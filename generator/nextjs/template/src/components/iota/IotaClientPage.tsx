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

// TODO: hardcoded Affinidi Vault webhook/login URL used to detect the
// "Affinidi Vault" case (duplicated from the redirect page / dev portal).
// Move to @affinidi-tdk/common once VaultUtils supports custom vault base URLs.
const AFFINIDI_VAULT_WEBHOOK_URL = "https://vault.affinidi.com/login";

// TODO: Move into @affinidi-tdk/common alongside buildShareLink. `webhookUrl`
// already includes the share path (".../login"), e.g. a TDK Vault deep link
// "tdkref://login".
function buildShareLinkForWebhook(
  webhookUrl: string,
  request: string,
  clientId: string,
): string {
  const params = new URLSearchParams();
  params.append("request", request);
  params.append("client_id", clientId);
  return `${webhookUrl}?${params.toString()}`;
}

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

  // authN for the websocket flow: Affinidi Login OR Auth0 (both via NextAuth).
  const { data: session } = useSession();

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
    try {
      setIsFormDisabled(true);
      const request = await iotaSessionQuery.data.prepareRequest({ queryId });
      setIsFormDisabled(false);
      addNewDataRequest(request);

      // For the Affinidi Vault, open the web vault directly. For a custom vault
      // (e.g. the TDK Vault reference app) the webhook is a deep link
      // (e.g. "tdkref://login") that can't be opened from a desktop browser, so
      // we surface the link for manual delivery to the vault app. The signed
      // request travels over the websocket, so its JWT is in request.payload.
      // TODO: source the Affinidi Vault detection + link building from
      // @affinidi-tdk/common once it supports custom vault webhook URLs.
      const webhookUrl = selectedConfiguration?.iotaResponseWebhookURL;
      if (!webhookUrl || webhookUrl === AFFINIDI_VAULT_WEBHOOK_URL) {
        request.openVault({ mode: openMode });
      } else {
        const link = buildShareLinkForWebhook(
          webhookUrl,
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

          {shareLink && (
            <div className="mt-6 p-4 border rounded-md">
              <p className="pb-2 font-semibold">
                Open this link in the TDK vault app (or paste it into &quot;Share
                VC&quot; &rarr; &quot;Paste request URL&quot;), then wait for the
                response below:
              </p>
              <pre className="whitespace-pre-wrap break-all text-sm">
                {shareLink}
              </pre>
              <div className="mt-3 flex gap-2">
                <Button onClick={() => navigator.clipboard.writeText(shareLink)}>
                  Copy link
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
                    <p className="pb-2 font-semibold">Request:</p>
                    <p className="pb-4">{id}</p>
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
                      {dataRequests[id].response && (
                        <>
                          <p className="pb-2 font-semibold">
                            Response received:
                          </p>
                          <pre>
                            {JSON.stringify(
                              dataRequests[id].response,
                              undefined,
                              2
                            )}
                          </pre>
                        </>
                      )}
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
