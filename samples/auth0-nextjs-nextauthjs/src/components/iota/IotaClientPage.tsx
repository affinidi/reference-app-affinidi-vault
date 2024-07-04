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
    result?: IotaResponse | IotaError;
  };
};

const fetchIotaConfigurations = (): Promise<void | SelectOption[]> =>
  fetch("/api/iota/configuration-options", { method: "GET" }).then((res) =>
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
    }
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
    }
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
  const [openMode, setOpenMode] = useState<OpenMode>(OpenMode.Popup);
  const [dataRequests, setDataRequests] = useState<DataRequests>({});
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  // Get did from session
  const { data: session } = useSession();

  const configurations = useQuery({
    queryKey: ["configurations"],
    queryFn: fetchIotaConfigurations,
    enabled: !!featureAvailable,
  });

  const iotaSession = useQuery({
    queryKey: ["iotaSession", selectedConfigId],
    queryFn: async ({ queryKey }) => {
      const credentials = await getIotaCredentials(queryKey[1]);
      const iotaSession = new Session({ credentials });
      await iotaSession.initialize();
      return iotaSession;
    },
    enabled: !!selectedConfigId,
  });

  const queryOptions = useQuery({
    queryKey: ["configurations", selectedConfigId],
    queryFn: ({ queryKey }) => getQueryOptions(queryKey[1]),
    enabled: !!selectedConfigId,
  });

  async function handleConfigurationChange(value: string | number) {
    clearSession();
    setSelectedConfigId(value as string);
  }

  async function handleTDKShare(queryId: string) {
    if (!iotaSession.data) {
      throw new Error("Iota session not initialized");
    }
    try {
      setIsFormDisabled(true);
      const request = await iotaSession.data.prepareRequest({ queryId });
      setIsFormDisabled(false);
      addNewDataRequest(request);
      request.openVault({ mode: openMode });
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
        result: response,
      },
    }));
  };

  const updateDataRequestWithError = (error: IotaError) => {
    if (error.correlationId) {
      setDataRequests((prevRequests) => ({
        ...prevRequests,
        [error.correlationId!]: {
          ...prevRequests[error.correlationId!],
          result: error,
        },
      }));
    }
  };

  async function clearSession() {
    setSelectedQuery("");
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

  const hasErrors = !featureAvailable || !session || !session.userId;
  const renderErrors = () => {
    if (!featureAvailable) {
      return (
        <div>
          Feature not available. Please set your Personal Access Token in your
          environment secrets.
        </div>
      );
    }

    if (!session || !session.userId) {
      return (
        <div>
          You must be logged in to issue credentials to your Affinidi Vault
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
          {renderVerifiedHolder(session.userId)}

          {configurations.isPending && (
            <div className="py-3">Loading configurations...</div>
          )}
          {!configurations.isPending && (
            <Select
              id="configurationIdSelect"
              label="Configuration"
              options={configurations.data || []}
              value={selectedConfigId}
              disabled={isFormDisabled}
              onChange={handleConfigurationChange}
            />
          )}

          {selectedConfigId && (
            <div>
              <Select
                id="openModeSelect"
                label="Open Mode"
                options={openModeOptions}
                value={openMode}
                disabled={isFormDisabled}
                onChange={(val) => setOpenMode(val as number)}
              />

              {queryOptions.isPending && (
                <div className="py-3">Loading queries...</div>
              )}
              {!queryOptions.isPending && (
                <Select
                  id="queryId"
                  label="Query"
                  options={queryOptions.data || []}
                  value={selectedQuery}
                  disabled={isFormDisabled}
                  onChange={(val) => setSelectedQuery(val as string)}
                />
              )}

              {!iotaSession.isPending && selectedQuery && (
                <Button
                  disabled={isFormDisabled}
                  onClick={() => handleTDKShare(selectedQuery)}
                >
                  Share
                </Button>
              )}

              {iotaSession.isPending && (
                <div className="py-3">
                  Initializing session with Affinidi Iota Framework...
                </div>
              )}
              {iotaSession.isError && <div>Failed to initialize Iota</div>}

              {Object.keys(dataRequests).length > 0 && (
                <div className="mt-8 border rounded-md">
                  <table className="table-fixed text-left w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="w-1/3 border-r px-4 py-2">Request ID</th>
                        <th className="w-2/3 px-4 py-2">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(dataRequests).map((id: string) => (
                        <tr key={id} className="border-b">
                          <td className="border-r px-4 py-2">{id}</td>
                          <td className="px-4 py-2">
                            <pre>
                              {dataRequests[id].result instanceof IotaError && (
                                <p>Error received:</p>
                              )}
                              {!(
                                dataRequests[id].result instanceof IotaError
                              ) && <p>Response received:</p>}
                              {JSON.stringify(
                                dataRequests[id].result,
                                undefined,
                                2
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
