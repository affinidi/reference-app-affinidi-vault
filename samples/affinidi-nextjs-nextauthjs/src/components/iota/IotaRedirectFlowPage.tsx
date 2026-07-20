import { useRouter } from "next/navigation";
import { IotaConfigurationDto } from "@affinidi-tdk/iota-client";
import { VaultUtils } from "@affinidi-tdk/common";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Select, { SelectOption } from "src/components/core/Select";
import Button from "src/components/core/Button";
import { useLocalStorage } from "@uidotdev/usehooks";

// TODO: This Affinidi Vault webhook/login URL is hardcoded here to detect the
// "Affinidi Vault" case. It duplicates AFFINIDI_VAULT_WEBHOOK_URL used by the
// dev portal (dev-portal-spa). Once @affinidi-tdk/common `VaultUtils.buildShareLink`
// supports a custom vault base URL, this constant and `buildShareLinkForWebhook`
// below should be removed in favour of the shared helper.
const AFFINIDI_VAULT_WEBHOOK_URL = "https://vault.affinidi.com/login";

// TODO: Move this into @affinidi-tdk/common (alongside `buildShareLink` /
// `buildClaimLink`) so custom vault webhook URLs — e.g. a TDK Vault deep link
// like "tdkref://login" — are supported there instead of being hardcoded in the
// reference app. `webhookUrl` already includes the share path (".../login"),
// matching VaultUtils' SHARE_PATH.
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
  const [shareLink, setShareLink] = useState<string>("");
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

    // For the Affinidi Vault the vault is a web app, so we auto-redirect the
    // browser to it. For a custom vault (e.g. the TDK Vault reference app) the
    // webhook is a deep link (e.g. "tdkref://login") that can't be opened from a
    // desktop browser, so we surface the link for the tester to open / paste
    // into the vault app manually.
    // TODO: source the Affinidi Vault detection + link building from
    // @affinidi-tdk/common once it supports custom vault webhook URLs.
    const webhookUrl = selectedConfiguration?.iotaResponseWebhookURL;

    if (!webhookUrl || webhookUrl === AFFINIDI_VAULT_WEBHOOK_URL) {
      const vaultLink = VaultUtils.buildShareLink(data.jwt, "client_id");
      router.push(vaultLink);
      return;
    }

    const link = buildShareLinkForWebhook(webhookUrl, data.jwt, "client_id");
    setShareLink(link);
    setIsFormDisabled(false);
  }

  async function clearSession() {
    setSelectedQuery("");
    setShareLink("");
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

          {shareLink && (
            <div className="mt-6 p-4 border rounded-md">
              <p className="pb-2 font-semibold">
                Open this link in the TDK vault app (or paste it into &quot;Share
                VC&quot; &rarr; &quot;Paste request URL&quot;):
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
        </>
      )}
    </>
  );
}
