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

export default function IotaCallbackPage() {
  const searchParams = useSearchParams();
  const responseCode = searchParams.get("response_code");

  const iotaRedirectString = localStorage.getItem("iotaRedirect") || "";
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

  return (
    <div>
      <h1>Data Loaded:</h1>
      <pre>Nonce matched: {iotaRedirect.nonce === iotaResponseQuery.data.nonce ? '✅' : '❌'}</pre>
      <pre>Full response: {JSON.stringify(iotaResponseQuery.data, null, 2)}</pre>
    </div>
  );
}
