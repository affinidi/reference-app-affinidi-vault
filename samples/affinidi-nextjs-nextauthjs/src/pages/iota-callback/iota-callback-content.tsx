import { GetServerSideProps } from "next";
import { personalAccessTokenConfigured } from "src/lib/env";
import { useQuery } from "@tanstack/react-query";

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
  const iotaRedirectString = "{}".toString();
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

  return (
    <>
      <pre>
        Generated nonce: {generatedNonce} | Received nonce: {receivedNonce} |
        Nonce matched: {matched ? "✅" : "❌"}
      </pre>
      <br />
      <br />
      <h1>Data Loaded:</h1>
      <pre>{JSON.stringify(iotaResponseQuery.data, null, 2)}</pre>
    </>
  );
};

export default IotaCallbackContent;
