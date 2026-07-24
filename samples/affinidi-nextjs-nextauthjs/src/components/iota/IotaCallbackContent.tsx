import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";

interface GetIotaResponseParams {
  configurationId: string;
  responseCode: string;
  correlationId: string;
  transactionId: string;
}

const getIotaResponse = async (params: GetIotaResponseParams) => {
  const response = await fetch("/api/iota/iota-response", {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return await response.json();
};

/**
 * Returns the credentials shared in a parsed `vp_token`, supporting both
 * response shapes:
 * - PEX: a single Verifiable Presentation object.
 * - DCQL (OID4VP 1.0 §8.1): an object keyed by credential-query id whose values
 *   are the presentation(s) that satisfy each query.
 */
const getSharedCredentials = (vp: any): any[] => {
  if (!vp || typeof vp !== "object") return [];
  const presentations =
    "proof" in vp || "holder" in vp || "verifiableCredential" in vp
      ? [vp]
      : Object.values(vp).flatMap((value: any) =>
          Array.isArray(value) ? value : [value]
        );
  return presentations.flatMap((presentation: any) => {
    const credentials = presentation?.verifiableCredential;
    if (Array.isArray(credentials)) return credentials;
    if (credentials) return [credentials];
    return [];
  });
};

const IotaCallbackContent = ({
  responseCode,
}: {
  responseCode: string | null;
}) => {
  const [iotaRedirectString] = useLocalStorage("iotaRedirect", "{}");
  const iotaRedirect = JSON.parse(iotaRedirectString);

  const iotaResponseQuery = useQuery({
    queryKey: ["queryOptions", iotaRedirectString],
    queryFn: ({ queryKey }) =>
      getIotaResponse({ ...JSON.parse(queryKey[1]), responseCode }),
    enabled: iotaRedirectString !== "" && responseCode !== null,
  });

  const loading = iotaResponseQuery.isFetching;
  const error = iotaResponseQuery.error;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const generatedNonce = iotaRedirect?.nonce;
  const receivedNonce = iotaResponseQuery?.data?.nonce;
  const matched = generatedNonce === receivedNonce;

  // Works for both PEX and DCQL (OID4VP 1.0 §8.1) vp_token shapes.
  const sharedCredentials = getSharedCredentials(iotaResponseQuery?.data?.vp);

  return (
    <>
      <pre>
        Generated nonce: {generatedNonce} | Received nonce: {receivedNonce} |
        Nonce matched: {matched ? "✅" : "❌"}
      </pre>
      <br />
      <br />
      <h1>Data Loaded:</h1>
      {sharedCredentials.length > 0 && (
        <ul>
          {sharedCredentials.map((vc: any, index: number) => (
            <li key={vc?.id ?? index}>
              {((vc?.type ?? []) as string[])
                .filter((type) => type !== "VerifiableCredential")
                .join(", ") || "Credential"}
            </li>
          ))}
        </ul>
      )}
      <pre>{JSON.stringify(iotaResponseQuery.data, null, 2)}</pre>
    </>
  );
};

export default IotaCallbackContent;
