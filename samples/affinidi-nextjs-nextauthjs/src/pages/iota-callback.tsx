import { GetServerSideProps } from "next";
import { personalAccessTokenConfigured } from "src/lib/env";
import { useSearchParams } from "next/navigation";
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

export const getServerSideProps = (async () => {
  return { props: { featureAvailable: personalAccessTokenConfigured() } };
}) satisfies GetServerSideProps<{ featureAvailable: boolean }>;

export default function IotaCallbackPage({
  featureAvailable,
}: {
  featureAvailable: boolean;
}) {
  const searchParams = useSearchParams();
  const responseCode = searchParams.get("response_code");
  const errorMessage = searchParams.get("error");

  const iotaRedirectString = localStorage.getItem("iotaRedirect") || "{}";
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

  const hasErrors = !featureAvailable || errorMessage;

  const renderErrors = () => {
    if (!featureAvailable) {
      return (
        <div>
          Feature not available. Please set your Personal Access Token in your
          environment secrets.
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div>
          <h1>{errorMessage}</h1>
        </div>
      );
    }
  };

  return (
    <>
      {renderErrors()}

      {!hasErrors && (
        <>
          <pre>
            Generated nonce: {generatedNonce} | Received nonce: {receivedNonce}{" "}
            | Nonce matched: {matched ? "✅" : "❌"}
          </pre>
          <br />
          <br />
          <h1>Data Loaded:</h1>
          <pre>{JSON.stringify(iotaResponseQuery.data, null, 2)}</pre>
        </>
      )}
    </>
  );
}
