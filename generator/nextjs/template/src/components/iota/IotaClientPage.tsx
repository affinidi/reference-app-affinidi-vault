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
import { IotaConfigurationDto } from "@affinidi-tdk/iota-client";

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

export default function IotaSessionMultipleRequestsPage() {
  const [holderDid, setHolderDid] = useState<string>("");
  const [configOptions, setConfigOptions] = useState<SelectOption[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [iotaResponses, setIotaResponses] = useState<IotaResponse[]>([]);
  const [iotaSession, setIotaSession] = useState<Session>();
  const [iotaIsInitializing, setIotaIsInitializing] = useState(false);
  const [iotaRequests, setIotaRequests] = useState<IotaRequest[]>([]);
  const [queryOptions, setQueryOptions] = useState<SelectOption[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [openMode, setOpenMode] = useState<OpenMode>(OpenMode.Popup);

  // Prefill did from session
  const { data: session } = useSession();
  useEffect(() => {
    if (!session || !session.user) return;
    setHolderDid(session.userId);
  }, [session]);

  useEffect(() => {
    const initConfigurations = async () => {
      try {
        const response = await fetch("/api/iota/configuration-options", {
          method: "GET",
        });
        const configurations = await response.json();
        setConfigOptions(configurations);
        console.log(configurations);
        if (configurations.length > 0) {
          handleConfigurationChange(configurations[0].value);
        }
      } catch (error) {
        console.error("Error getting Iota configurations:", error);
      }
    };
    initConfigurations();
  }, []);

  async function handleConfigurationChange(value: string | number) {
    const configId = value as string;
    clearSession();
    setSelectedConfig(configId);
    if (!configId) {
      return;
    }
    try {
      setIotaIsInitializing(true);
      getQueryOptions(configId);
      const credentials = await getIotaCredentials(configId);
      const iotaSession = new Session({ credentials });
      await iotaSession.initialize();
      setIotaSession(iotaSession);
    } catch (error) {
      console.error("Error initializing Iota Session:", error);
    } finally {
      setIotaIsInitializing(false);
    }
  }

  async function getQueryOptions(configurationId: string) {
    const response = await fetch(
      "/api/iota/query-options?" +
        new URLSearchParams({
          iotaConfigurationId: configurationId,
        }),
      {
        method: "GET",
      },
    );
    const options = (await response.json()) as SelectOption[];
    setQueryOptions(options);
  }

  async function getIotaCredentials(configurationId: string) {
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
  }

  async function handleTDKShare(queryId: string) {
    if (!iotaSession) {
      throw new Error("IotaSession not initialized");
    }
    try {
      console.log(queryId);
      const request = await iotaSession.prepareRequest({ queryId });
      console.log(request);
      setIotaRequests((prevArray) => [...prevArray, request]);
      request.openVault({ mode: openMode });
      const response = await request.getResponse();
      setIotaResponses((prevArray) => [...prevArray, response]);
    } catch (e) {
      console.error(e);
    }
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
        <div className="pb-4">
          <p className="font-semibold">
            Verified holder did (From Affinidi Login)
          </p>
          <p>{holderDid}</p>
        </div>
      )}

      {holderDid && configOptions.length === 0 && (
        <div className="py-3">Loading configurations...</div>
      )}

      {holderDid && configOptions.length > 0 && (
        <Select
          id="configurationIdSelect"
          label="Configuration"
          options={configOptions}
          value={selectedConfig}
          onChange={handleConfigurationChange}
        />
      )}

      {holderDid && selectedConfig && (
        <div>
          <Select
            id="openModeSelect"
            label="Open Mode"
            options={openModeOptions}
            value={openMode}
            onChange={handleOpenModeChange}
          />

          {queryOptions.length === 0 && (
            <div className="py-3">Loading queries...</div>
          )}
          {queryOptions.length > 0 && (
            <Select
              id="queryId"
              label="Query"
              options={queryOptions}
              value={selectedQuery}
              onChange={handleQueryChange}
            />
          )}

          {iotaSession && selectedQuery && (
            <Button onClick={() => handleTDKShare(selectedQuery)}>Share</Button>
          )}

          {iotaIsInitializing && (
            <div className="py-3">
              Initializing session with Affinidi Iota Framework...
            </div>
          )}
          {selectedConfig && !iotaIsInitializing && !iotaSession && (
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
                    response.vpToken.verifiableCredential[0].credentialSubject,
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
