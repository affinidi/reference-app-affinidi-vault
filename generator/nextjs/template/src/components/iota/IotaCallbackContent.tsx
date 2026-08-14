import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { getSharedCredentials } from "src/lib/iota/share";

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
  const vp = iotaResponseQuery?.data?.vp;
  const sharedCredentials = getSharedCredentials(vp);
  const credentialSubjects = sharedCredentials
    .map((vc: any) => vc?.credentialSubject)
    .filter(Boolean);
  const credentialTypes = sharedCredentials
    .map(
      (vc: any) =>
        ((vc?.type ?? []) as string[])
          .filter((type) => type !== "VerifiableCredential")
          .join(", ") || "Credential"
    )
    .join(", ");
  const credentialSubjectInline = credentialSubjects
    .map((s: any) => JSON.stringify(s, null, 2).replace(/\s+/g, " "))
    .join(", ");
  // DCQL responses are a vp_token object keyed by query id (no single top-level
  // VP); PEX responses are a single VP.
  const queryFormat =
    vp &&
    typeof vp === "object" &&
    !("proof" in vp || "holder" in vp || "verifiableCredential" in vp)
      ? "DCQL"
      : "PEX";
  const integrationMode = iotaRedirect?.integrationMode ?? "Affinidi Vault";

  return (
    <>
      <pre>
        Generated nonce: {generatedNonce} | Received nonce: {receivedNonce} |
        Nonce matched: {matched ? "✅" : "❌"}
      </pre>
      <br />
      <p className="pb-2 font-semibold">Response received:</p>
      <p className="pb-2">
        Query format: <span className="font-bold">{queryFormat}</span>
      </p>
      <p className="pb-2">
        Integration Mode: <span className="font-bold">{integrationMode}</span>
      </p>
      {credentialTypes && (
        <p className="pb-2">
          Credential Type: <span className="font-bold">{credentialTypes}</span>
        </p>
      )}
      {credentialSubjectInline && (
        <p className="pb-2 break-all">
          CredentialSubject:{" "}
          <span className="font-bold">{credentialSubjectInline}</span>
        </p>
      )}
      <details className="mt-2">
        <summary className="cursor-pointer font-semibold">
          Full response
        </summary>
        <pre className="mt-2">
          {JSON.stringify(iotaResponseQuery.data, null, 2)}
        </pre>
      </details>
    </>
  );
};

export default IotaCallbackContent;
