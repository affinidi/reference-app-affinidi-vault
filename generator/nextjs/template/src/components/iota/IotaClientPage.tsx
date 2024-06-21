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

type DataRequests = {
  [id: string]: {
    request: IotaRequest;
    response?: IotaResponse;
  };
};

export default function IotaSessionMultipleRequestsPage({
  featureAvailable,
}: {
  featureAvailable: boolean;
}) {
  const [holderDid, setHolderDid] = useState<string>("");
  const [configOptions, setConfigOptions] = useState<SelectOption[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [iotaSession, setIotaSession] = useState<Session>();
  const [iotaIsInitializing, setIotaIsInitializing] = useState(false);
  const [queryOptions, setQueryOptions] = useState<SelectOption[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [openMode, setOpenMode] = useState<OpenMode>(OpenMode.Popup);
  const [dataRequests, setDataRequests] = useState<DataRequests>({});
  const [isFormDisabled, setIsFormDisabled] = useState(false);

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
    if (featureAvailable) {
      initConfigurations();
    }
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
      setIsFormDisabled(true);
      const request = await iotaSession.prepareRequest({ queryId });
      setIsFormDisabled(false);
      console.log(request);
      addNewDataRequest(request);
      request.openVault({ mode: openMode });
      const response = await request.getResponse();
      updateDataRequestWithResponse(response);
    } catch (e) {
      console.error(e);
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
    setIsFormDisabled(false);
  }

  return (
    <>
      <h1 className="text-2xl font-semibold pb-6">Receive Credentials</h1>

      {!featureAvailable && (
        <div>
          Feature not available. Please set your Personal Access Token in your
          environment secrets.
        </div>
      )}

      {featureAvailable && !holderDid && (
        <div>
          You must be logged in to share credentials from your Affinidi Vault
        </div>
      )}

      {featureAvailable && holderDid && (
        <>
          <div className="pb-4">
            <p className="font-semibold">
              Verified holder did (From Affinidi Login)
            </p>
            <p>{holderDid}</p>
          </div>

          {configOptions.length === 0 && (
            <div className="py-3">Loading configurations...</div>
          )}

          {configOptions.length > 0 && (
            <Select
              id="configurationIdSelect"
              label="Configuration"
              options={configOptions}
              value={selectedConfig}
              disabled={isFormDisabled}
              onChange={handleConfigurationChange}
            />
          )}

          {selectedConfig && (
            <div>
              <Select
                id="openModeSelect"
                label="Open Mode"
                options={openModeOptions}
                value={openMode}
                disabled={isFormDisabled}
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
                  disabled={isFormDisabled}
                  onChange={handleQueryChange}
                />
              )}

              {iotaSession && selectedQuery && (
                <Button
                  disabled={isFormDisabled}
                  onClick={() => handleTDKShare(selectedQuery)}
                >
                  Share
                </Button>
              )}

              {iotaIsInitializing && (
                <div className="py-3">
                  Initializing session with Affinidi Iota Framework...
                </div>
              )}
              {selectedConfig && !iotaIsInitializing && !iotaSession && (
                <div>Failed to initialize Iota</div>
              )}

              {Object.keys(dataRequests).length > 0 && (
                <div className="mt-8 border rounded-md">
                  <table className="table-fixed text-left w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="border-r px-4 py-2">Request ID</th>
                        <th className="px-4 py-2">Response</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(dataRequests).map((id: string) => (
                        <tr className="border-b">
                          <td className="border-r px-4 py-2">{id}</td>
                          <td className="px-4 py-2">
                            <pre>
                              {JSON.stringify(
                                dataRequests[id].response?.vpToken,
                                undefined,
                                2,
                              )}
                            </pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
