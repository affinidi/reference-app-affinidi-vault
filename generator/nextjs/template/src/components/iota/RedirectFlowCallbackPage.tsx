import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'

// export default function IotaCallbackPage ({
//   featureAvailable,
// }: {
//   featureAvailable: boolean;
// }) {
export default function IotaCallbackPage () {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const searchParams = useSearchParams()
  const responseCode = searchParams.get('response_code');

  const iotaRedirectString = localStorage.getItem('iotaRedirect') || '';

  // if (!iotaRedirectString) {
  //   throw Error('DB record is missing. Restart the flow.')
  // }

  const { configurationId, correlationId, transactionId } = JSON.parse(iotaRedirectString);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/iota/iota-response", {
        method: "POST",
        body: JSON.stringify({
          responseCode,
          configurationId,
          correlationId,
          transactionId,
        }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      })

      const result = await response.json();
      setData(result);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // const hasErrors = !featureAvailable;

  // const renderErrors = () => {
  //   if (!featureAvailable) {
  //     return (
  //       <div>
  //         Feature not available. Please set your Personal Access Token in your
  //         environment secrets.
  //       </div>
  //     );
  //   }
  // };

  return (
    <div>
      <h1>Data Loaded:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
