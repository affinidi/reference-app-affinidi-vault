export default function IotaCallbackPageError({
  errorMessage,
  featureAvailable,
}: {
  featureAvailable: boolean;
  errorMessage: string | null;
}) {
  if (!featureAvailable) {
    return (
      <div>
        Feature not available. Please set your Personal Access Token in your
        environment secrets.
      </div>
    );
  }

  return (
    <div>
      <h1>{errorMessage}</h1>
    </div>
  );
}
