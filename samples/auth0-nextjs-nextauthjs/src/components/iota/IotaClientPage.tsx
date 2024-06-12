import {
  IotaRequest,
  IotaResponse,
  OpenMode,
  Session,
} from "@affinidi-tdk/iota-browser";
import { IotaCredentials } from "@affinidi-tdk/iota-utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "../core/Button";
import Select, { SelectOption } from "../core/Select";

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

export default function IotaSessionMultipleRequestsPage({
  configOptions,
}: {
  configOptions: SelectOption[];
}) {
  const [holderDid, setHolderDid] = useState<string>("");
  const [iotaResponses, setIotaResponses] = useState<IotaResponse[]>([]);
  const [iotaSession, setIotaSession] = useState<Session>();
  const [iotaIsInitializing, setIotaIsInitializing] = useState(false);
  const [iotaRequests, setIotaRequests] = useState<IotaRequest[]>([]);
  const [iotaConfiguration, setIotaConfiguration] = useState<string>("");
  const [queryOptions, setQueryOptions] = useState<SelectOption[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [openMode, setOpenMode] = useState<OpenMode>(OpenMode.Popup);

  // Prefill did from session
  const { data: session } = useSession();
  useEffect(() => {
    if (!session || !session.user) return;
    setHolderDid(session.userId);
  }, [session]);

  async function handleConfigurationChange(value: string | number) {
    const configId = value as string;
    clearSession();
    setIotaConfiguration(configId);
    try {
      setIotaIsInitializing(true);
      fetchQueries(configId);
      const response = await fetch(
        "/api/iota/start?" +
          new URLSearchParams({
            iotaConfigurationId: configId,
          }),
        {
          method: "GET",
        }
      );
      const credentials = (await response.json()) as IotaCredentials;
      const iotaSession = new Session({ credentials });
      await iotaSession.initialize();
      setIotaSession(iotaSession);
    } catch (error) {
      console.error("Error initializing Iota Session:", error);
    } finally {
      setIotaIsInitializing(false);
    }
  }

  async function fetchQueries(configurationId: string) {
    const response = await fetch(
      "/api/iota/query-options?" +
        new URLSearchParams({
          iotaConfigurationId: configurationId,
        }),
      {
        method: "GET",
      }
    );
    const options = (await response.json()) as SelectOption[];
    setQueryOptions(options);
  }

  async function handleTDKShare(queryId: string) {
    if (!iotaSession) {
      throw new Error("IotaSession not initialized");
    }
    const request = await iotaSession.prepareRequest({
      queryId,
      audience: "this field should not be used",
    });

    setIotaRequests((prevArray) => [...prevArray, request]);
    request.openVault({ mode: openMode });
    const response = await request.getResponse();
    setIotaResponses((prevArray) => [...prevArray, response]);
  }

  async function handleOpenModeChange(value: string | number) {
    setOpenMode(value as number);
  }

  async function handleQueryChange(value: string | number) {
    setSelectedQuery(value as string);
  }

  async function clearSession() {
    setIotaSession(undefined);
    setQueryOptions([]);
    setSelectedQuery("");
  }

  return (
    <>
      <h1 className="text-2xl font-semibold pb-6">Receive Credentials</h1>
      {!holderDid && (
        <div>
          You must be logged in to share credentials from your Affinidi Vault
        </div>
      )}
      {holderDid && (
        <div>
          <div className="pb-4">
            <p className="font-semibold">
              Verified holder did (From Affinidi Login)
            </p>
            <p>{holderDid}</p>
          </div>

          <Select
            id="configurationIdSelect"
            label="Configuration"
            options={configOptions}
            value={iotaConfiguration}
            onChange={handleConfigurationChange}
          />

          <Select
            id="openModeSelect"
            label="Open Mode"
            options={openModeOptions}
            value={openMode}
            onChange={handleOpenModeChange}
          />

          {queryOptions.length > 0 && (
            <Select
              id="queryId"
              label="Query ID"
              options={queryOptions}
              value={selectedQuery}
              onChange={handleQueryChange}
            />
          )}

          {iotaSession && selectedQuery && (
            <Button onClick={() => handleTDKShare(selectedQuery)}>Share</Button>
          )}

          {iotaIsInitializing && (
            <div>Initializing session with Affinidi Iota Framework...</div>
          )}
          {iotaConfiguration && !iotaIsInitializing && !iotaSession && (
            <div>Failed to initialize Iota</div>
          )}
          {iotaRequests.length > 0 && (
            <div className="pt-8">
              <p className="font-semibold">Requests:</p>
              {iotaRequests.map((request) => (
                <p key={request.correlationId}>{request.correlationId}</p>
              ))}
            </div>
          )}
          {iotaResponses.length > 0 && (
            <div className="pt-8">
              <p className="font-semibold">Responses:</p>
              {iotaResponses.map((response) => (
                <p key={response.correlationId}>
                  {response.correlationId}:{" "}
                  {JSON.stringify(
                    response.vpToken.verifiableCredential[0].credentialSubject
                  )}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
