import {
  IotaCredentials,
  IotaError,
  IotaRequest,
  IotaResponse,
  OpenMode,
  Session,
} from "@affinidi-tdk/iota-browser";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Button from "../core/Button";
import Select, { SelectOption } from "../core/Select";
import { IotaConfigurationDto } from "@affinidi-tdk/iota-client";
import {
  AFFINIDI_VAULT_WEBHOOK_URL,
  buildShareLinkForWebhook,
  getSharedCredentials,
} from "src/lib/iota/share";

// NextAuth provider ids. Kept in sync with next-auth-provider.ts; defined
// locally to avoid importing that server-only module (it reads secret env
// vars) into this client component.
const AUTH0_PROVIDER_ID = "auth0";
const AFFINIDI_PROVIDER_ID = "affinidi";

const openModeOptions = [
  {
    label: "New Tab",
    value: OpenMode.NewTab,
  },
  {
    label: "Popup",
    value: OpenMode.Popup,
  },
];

type DataRequests = {
  [id: string]: {
    request: IotaRequest;
    response?: IotaResponse;
    error?: IotaError;
  };
};

const fetchIotaConfigurations = (): Promise<IotaConfigurationDto[]> =>
  fetch("/api/iota/configurations", { method: "GET" }).then((res) =>
    res.json()
  );

const getQueryOptions = async (configurationId: string) => {
  const response = await fetch(
    "/api/iota/query-options?" +
      new URLSearchParams({
        iotaConfigurationId: configurationId,
      }),
    {
      method: "GET",
    },
  );
  return (await response.json()) as SelectOption[];
};

const getIotaCredentials = async (configurationId: string) => {
  const response = await fetch(
    "/api/iota/start?" +
      new URLSearchParams({
        iotaConfigurationId: configurationId,
      }),
    {
      method: "GET",
    },
  );
  return (await response.json()) as IotaCredentials;
};

export default function IotaSessionMultipleRequestsPage({
  featureAvailable,
}: {
  featureAvailable: boolean;
}) {
  const [selectedConfigId, setSelectedConfigId] = useState<string>("");
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [openMode, setOpenMode] = useState<OpenMode>(OpenMode.NewTab);
  const [dataRequests, setDataRequests] = useState<DataRequests>({});
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");
  const [requiredLogin, setRequiredLogin] = useState<
    null | "auth0" | "affinidi"
  >(null);
  const [showFullLink, setShowFullLink] = useState(false);

  // authN for the websocket flow: Affinidi Login OR Auth0 (both via NextAuth).
  const { data: session } = useSession();
  const isAuth0 = session?.provider === AUTH0_PROVIDER_ID;
  const isAffinidiLogin = session?.provider === AFFINIDI_PROVIDER_ID;

  const configurationsQuery = useQuery({
    queryKey: ["iotaConfigurations"],
    queryFn: fetchIotaConfigurations,
    // Only fetch once authenticated — the endpoint returns 401 (not an array)
    // when not logged in, which would break the list/find below.
    enabled: !!featureAvailable && !!session,
  });

  const iotaSessionQuery = useQuery({
    queryKey: ["iotaSession", selectedConfigId],
    queryFn: async ({ queryKey }) => {
      const credentials = await getIotaCredentials(queryKey[1]);
      const iotaSession = new Session({ credentials });
      await iotaSession.initialize();
      return iotaSession;
    },
    enabled: !!selectedConfigId,
  });

  const iotaQueryOptionsQuery = useQuery({
    queryKey: ["queryOptions", selectedConfigId],
    queryFn: ({ queryKey }) => getQueryOptions(queryKey[1]),
    enabled: !!selectedConfigId,
  });

  const selectedConfiguration = Array.isArray(configurationsQuery.data)
    ? configurationsQuery.data.find(
        (configuration) => configuration.configurationId === selectedConfigId,
      )
    : undefined;

  async function handleConfigurationChange(value: string | number) {
    clearSession();
    setSelectedConfigId(value as string);
  }

  async function handleTDKShare(queryId: string) {
    if (!iotaSessionQuery.data) {
      throw new Error("Iota session not initialized");
    }

    // Each vault target requires a matching login provider:
    // - Affinidi Vault  -> Affinidi Login
    // - custom vault (e.g. the TDK Vault reference app) -> Auth0
    // The TDK Vault app rejects requests carrying the `aud` claim that Affinidi
    // Login adds, so prompt for the correct provider instead of generating a
    // request/link that won't work.
    const webhookUrl = selectedConfiguration?.iotaResponseWebhookURL;
    const isCustomVault =
      !!webhookUrl && webhookUrl !== AFFINIDI_VAULT_WEBHOOK_URL;
    setRequiredLogin(null);
    if (isCustomVault && !isAuth0) {
      setRequiredLogin("auth0");
      return;
    }
    if (!isCustomVault && !isAffinidiLogin) {
      setRequiredLogin("affinidi");
      return;
    }

    try {
      setIsFormDisabled(true);
      const request = await iotaSessionQuery.data.prepareRequest({ queryId });
      setIsFormDisabled(false);
      addNewDataRequest(request);

      // Affinidi Vault: open the web vault directly. Custom vault (e.g. the TDK
      // Vault reference app): the webhook is a deep link that can't be opened
      // from a desktop browser, so surface the link for manual delivery. The
      // signed request travels over the websocket (JWT in request.payload).
      if (!isCustomVault) {
        request.openVault({ mode: openMode });
      } else {
        const link = buildShareLinkForWebhook(
          webhookUrl!,
          request.payload.request,
          request.payload.client_id,
        );
        setShareLink(link);
      }

      const response = await request.getResponse();
      updateDataRequestWithResponse(response);
    } catch (error) {
      if (error instanceof IotaError) {
        updateDataRequestWithError(error);
        console.log(error.code);
      }
    }
  }

  const addNewDataRequest = (request: IotaRequest) => {
    setDataRequests((prevRequests) => ({
      ...prevRequests,
      [request.correlationId]: { request },
    }));
  };

  const updateDataRequestWithResponse = (response: IotaResponse) => {
    setDataRequests((prevRequests) => ({
      ...prevRequests,
      [response.correlationId]: {
        ...prevRequests[response.correlationId],
        response,
      },
    }));
  };

  const updateDataRequestWithError = (error: IotaError) => {
    if (error.correlationId) {
      setDataRequests((prevRequests) => ({
        ...prevRequests,
        [error.correlationId!]: {
          ...prevRequests[error.correlationId!],
          error,
        },
      }));
    }
  };

  async function clearSession() {
    setSelectedQuery("");
    setShareLink("");
    setShowFullLink(false);
    setRequiredLogin(null);
    setIsFormDisabled(false);
  }

  const renderVerifiedHolder = (userId: string) => {
    return (
      <div className="pb-4">
        <p className="font-semibold">
          Verified holder did (From Affinidi Login)
        </p>
        <p>{userId}</p>
      </div>
    );
  };

  const hasErrors = !featureAvailable || !session;
  const renderErrors = () => {
    if (!featureAvailable) {
      return (
        <div>
          Feature not available. Please set your Personal Access Token in your
          environment secrets.
        </div>
      );
    }

    if (!session) {
      return (
        <div>
          You must be logged in (Affinidi Login or Auth0) to use the websocket
          data sharing flow.
        </div>
      );
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold pb-6">Receive Credentials</h1>

      {renderErrors()}
      {!hasErrors && (
        <>
          {session?.userId && renderVerifiedHolder(session.userId)}

          {configurationsQuery.isPending && (
            <div className="py-3">Loading configurations...</div>
          )}
          {configurationsQuery.isSuccess &&
            configurationsQuery.data.length === 0 && (
              <div className="py-3">
                You don&apos;t have any configurations. Go to the{" "}
                <a className="text-blue-500" href="https://portal.affinidi.com">
                  Affinidi Portal
                </a>{" "}
                to create one.
              </div>
            )}
          {configurationsQuery.isSuccess &&
            configurationsQuery.data.length > 0 && (
              <Select
                id="configurationIdSelect"
                label="Configuration"
                options={configurationsQuery.data.map((configuration) => ({
                  label: configuration.name,
                  value: configuration.configurationId,
                }))}
                value={selectedConfigId}
                disabled={isFormDisabled}
                onChange={handleConfigurationChange}
              />
            )}
          {selectedConfigId && (
            <Select
              id="openModeSelect"
              label="Open Mode"
              options={openModeOptions}
              value={openMode}
              disabled={isFormDisabled}
              onChange={(val) => setOpenMode(val as number)}
            />
          )}

          {iotaQueryOptionsQuery.isFetching && (
            <div className="py-3">Loading queries...</div>
          )}
          {iotaQueryOptionsQuery.isSuccess &&
            !iotaQueryOptionsQuery.isFetching &&
            iotaQueryOptionsQuery.data.length === 0 && (
              <div className="py-3">
                You don&apos;t have any queries. Go to the{" "}
                <a className="text-blue-500" href="https://portal.affinidi.com">
                  Affinidi Portal
                </a>{" "}
                to create one.
              </div>
            )}
          {iotaQueryOptionsQuery.isSuccess &&
            !iotaQueryOptionsQuery.isFetching &&
            iotaQueryOptionsQuery.data.length > 0 && (
              <Select
                id="queryId"
                label="Query"
                options={iotaQueryOptionsQuery.data || []}
                value={selectedQuery}
                disabled={isFormDisabled}
                onChange={(val) => setSelectedQuery(val as string)}
              />
            )}

          {iotaSessionQuery.isSuccess && selectedQuery && (
            <Button
              disabled={isFormDisabled}
              onClick={() => handleTDKShare(selectedQuery)}
            >
              Share
            </Button>
          )}

          {requiredLogin && (
            <div className="mt-6 p-4 border rounded-md">
              <p className="font-semibold">
                {requiredLogin === "auth0"
                  ? "Please login with Auth0"
                  : "Please login with Affinidi"}
              </p>
            </div>
          )}

          {shareLink && !requiredLogin && (
            <div className="mt-6 p-4 border rounded-md">
              <p className="pb-2 font-semibold">
                Open this link in the TDK vault app (or paste it into &quot;Share
                VC&quot; &rarr; &quot;Paste request URL&quot;), then wait for the
                response below:
              </p>
              <pre className="whitespace-pre-wrap break-all text-sm">
                {showFullLink ? shareLink : `${shareLink.slice(0, 80)}\u2026`}
              </pre>
              <div className="mt-3 flex gap-2">
                <Button onClick={() => navigator.clipboard.writeText(shareLink)}>
                  Copy link
                </Button>
                <Button onClick={() => setShowFullLink((v) => !v)}>
                  {showFullLink ? "Collapse" : "Expand"}
                </Button>
                <Button onClick={() => window.open(shareLink, "_self")}>
                  Open link
                </Button>
              </div>
            </div>
          )}

          {iotaSessionQuery.isFetching && (
            <div className="py-3">
              Initializing session with Affinidi Iota Framework...
            </div>
          )}
          {iotaSessionQuery.isError && <div>Failed to initialize Iota</div>}

          {Object.keys(dataRequests).length > 0 && (
            <div className="mt-8">
              {Object.keys(dataRequests)
                .reverse()
                .map((id: string) => (
                  <div
                    key={id}
                    className="mt-4 p-6 px-6 border rounded-md overflow-x-auto"
                  >
                    <p className="pb-4">
                      <span className="font-semibold">Request:</span> {id}
                    </p>
                    <div>
                      {dataRequests[id].error && (
                        <>
                          <p className="pb-2 font-semibold">Error received:</p>
                          <pre>
                            {JSON.stringify(
                              dataRequests[id].error,
                              undefined,
                              2
                            )}
                          </pre>
                        </>
                      )}
                      {dataRequests[id].response &&
                        (() => {
                          const response = dataRequests[id].response!;
                          let parsedVpToken: any = null;
                          try {
                            parsedVpToken = response.vpToken
                              ? JSON.parse(response.vpToken)
                              : null;
                          } catch {
                            parsedVpToken = null;
                          }
                          const sharedCredentials =
                            getSharedCredentials(parsedVpToken);
                          const credentialSubjects = sharedCredentials
                            .map((vc: any) => vc?.credentialSubject)
                            .filter(Boolean);
                          const credentialTypes = sharedCredentials
                            .map(
                              (vc: any) =>
                                ((vc?.type ?? []) as string[])
                                  .filter(
                                    (type) => type !== "VerifiableCredential"
                                  )
                                  .join(", ") || "Credential"
                            )
                            .join(", ");
                          const credentialSubjectInline = credentialSubjects
                            .map((s: any) =>
                              JSON.stringify(s, null, 2).replace(/\s+/g, " ")
                            )
                            .join(", ");
                          // DCQL responses (OID4VP 1.0 §8.1) carry no
                          // presentation_submission; PEX responses do.
                          const format = response.presentationSubmission
                            ? "PEX"
                            : "DCQL";
                          const webhookUrl =
                            selectedConfiguration?.iotaResponseWebhookURL;
                          const integrationMode =
                            !webhookUrl ||
                            webhookUrl === AFFINIDI_VAULT_WEBHOOK_URL
                              ? "Affinidi Vault"
                              : "Affinidi TDK Vault";
                          return (
                            <>
                              <p className="pb-2 font-semibold">
                                Response received:
                              </p>
                              <p className="pb-2">
                                Query format:{" "}
                                <span className="font-bold">{format}</span>
                              </p>
                              <p className="pb-2">
                                Integration Mode:{" "}
                                <span className="font-bold">
                                  {integrationMode}
                                </span>
                              </p>
                              {credentialTypes && (
                                <p className="pb-2">
                                  Credential Type:{" "}
                                  <span className="font-bold">
                                    {credentialTypes}
                                  </span>
                                </p>
                              )}
                              {credentialSubjectInline && (
                                <p className="pb-2 break-all">
                                  CredentialSubject:{" "}
                                  <span className="font-bold">
                                    {credentialSubjectInline}
                                  </span>
                                </p>
                              )}
                              <details className="mt-2">
                                <summary className="cursor-pointer font-semibold">
                                  Full response
                                </summary>
                                <pre className="mt-2">
                                  {JSON.stringify(response, undefined, 2)}
                                </pre>
                              </details>
                            </>
                          );
                        })()}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
