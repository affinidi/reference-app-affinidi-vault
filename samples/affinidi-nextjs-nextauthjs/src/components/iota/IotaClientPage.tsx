import {
  IotaCredentials,
  IotaError,
  IotaRequest,
  IotaResponse,
  OpenMode,
  Session,
} from "@affinidi-tdk/iota-browser";
import { IotaConfigurationDtoModeEnum } from "@affinidi-tdk/iota-client";
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
    response?: IotaResponse;
    error?: IotaError;
  };
};

const fetchIotaConfigurations = (): Promise<SelectOption[]> =>
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
  const [openMode, setOpenMode] = useState<OpenMode>(OpenMode.NewTab);
  const [dataRequests, setDataRequests] = useState<DataRequests>({});
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isWebsocket, setIsWebsocket] = useState(false);
  const [redirectUris, setRedirectUris] = useState<string[]>([""]);

  // Get did from session
  const { data: session } = useSession();

  const configurationsQuery = useQuery({
    queryKey: ["iotaConfigurations"],
    queryFn: fetchIotaConfigurations,
    enabled: !!featureAvailable,
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

  async function handleConfigurationChange(value: string | number) {
    clearSession();
    setSelectedConfigId(value as string);
    const selectedConfig = configurationsQuery?.data?.find(
      (config) => config.value === value
    );
    setIsWebsocket(
      selectedConfig?.mode === IotaConfigurationDtoModeEnum.Websocket
    );

    if (!isWebsocket) {
      setRedirectUris(selectedConfig?.redirectUris);
    }
    console.log(redirectUris);
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
          You must be logged in to request credentials from your Affinidi Vault
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
                options={configurationsQuery.data || []}
                value={selectedConfigId}
                disabled={isFormDisabled}
                onChange={handleConfigurationChange}
              />
            )}
          {selectedConfigId && isWebsocket && (
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

          {iotaSessionQuery.isSuccess && selectedQuery && isWebsocket && (
            <Button
              disabled={isFormDisabled}
              onClick={() => handleTDKShare(selectedQuery)}
            >
              Share
            </Button>
          )}

          {iotaSessionQuery.isFetching && isWebsocket && (
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
