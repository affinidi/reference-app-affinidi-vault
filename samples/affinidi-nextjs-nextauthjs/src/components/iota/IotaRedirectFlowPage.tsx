import { useRouter } from "next/navigation";
import { IotaConfigurationDto } from "@affinidi-tdk/iota-client";
import { VaultUtils } from "@affinidi-tdk/common";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Select, { SelectOption } from "src/components/core/Select";
import Button from "src/components/core/Button";
import { useLocalStorage } from "@uidotdev/usehooks";

const fetchIotaConfigurations = (): Promise<IotaConfigurationDto[]> =>
  fetch("/api/iota/redirect-configurations", { method: "GET" }).then((res) =>
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

export default function IotaRedirectFlowPage({
  featureAvailable,
}: {
  featureAvailable: boolean;
}) {
  const router = useRouter();

  const [selectedConfigId, setSelectedConfigId] = useState<string>("");
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [nonce, setNonce] = useState<string>("");
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [selectedRedirectUri, setSelectedRedirectUri] = useState<string>("");
  const [_, setIotaRedirect] = useLocalStorage("iotaRedirect", "{}");

  const configurationsQuery = useQuery({
    queryKey: ["iotaConfigurations"],
    queryFn: fetchIotaConfigurations,
    enabled: !!featureAvailable,
  });

  const iotaQueryOptionsQuery = useQuery({
    queryKey: ["queryOptions", selectedConfigId],
    queryFn: ({ queryKey }) => getQueryOptions(queryKey[1]),
    enabled: !!selectedConfigId,
  });

  async function handleConfigurationChange(value: string | number) {
    clearSession();
    setSelectedConfigId(value as string);
    const nonce = uuidv4().slice(0, 10);
    setNonce(nonce);
  }

  const selectedConfiguration = configurationsQuery?.data?.find(
    (query) => query.configurationId === selectedConfigId
  );

  async function handleRedirectFlowShare(queryId: string) {
    setIsFormDisabled(true);

    const response = await fetch("/api/iota/init-share", {
      method: "POST",
      body: JSON.stringify({
        configurationId: selectedConfigId,
        queryId,
        redirectUri: selectedRedirectUri,
        nonce,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.json();

    const toStore = {
      nonce,
      configurationId: selectedConfigId,
      correlationId: data.correlationId,
      transactionId: data.transactionId,
    };

    setIotaRedirect(JSON.stringify(toStore));

    const vaultLink = VaultUtils.buildShareLink(data.jwt, "client_id");
    router.push(vaultLink);
  }

  async function clearSession() {
    setSelectedQuery("");
    setIsFormDisabled(false);
  }

  const hasErrors = !featureAvailable;

  const renderErrors = () => {
    if (!featureAvailable) {
      return (
        <div>
          Feature not available. Please set your Personal Access Token in your
          environment secrets.
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
              id="redirectUrlSelect"
              label="Redirect URL (expecting URL with /iota-callback)"
              value={selectedRedirectUri}
              options={
                selectedConfiguration?.redirectUris?.map((uri) => ({
                  label: uri,
                  value: uri,
                })) || []
              }
              onChange={(val) => setSelectedRedirectUri(val as string)}
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

          {selectedQuery && (
            <>
              <h1>Generated nonce: {nonce}</h1>
              <br />

              <Button
                disabled={isFormDisabled}
                onClick={() => handleRedirectFlowShare(selectedQuery)}
              >
                Share
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
}
