import { GetStaticProps } from "next";
import { personalAccessTokenConfigured } from "src/lib/env";
import { useSearchParams } from "next/navigation";
import IotaCallbackPageError from "./iota-callback-error";
import IotaCallbackContent from "./iota-callback-content";
import { useIsClient } from "@uidotdev/usehooks";

export const getStaticProps = (async () => {
  return { props: { featureAvailable: personalAccessTokenConfigured() } };
}) satisfies GetStaticProps<{ featureAvailable: boolean }>;

export default function IotaCallbackPage({
  featureAvailable,
}: {
  featureAvailable: boolean;
}) {
  const searchParams = useSearchParams();
  const responseCode = searchParams.get("response_code");
  const errorMessage = searchParams.get("error");
  const isClient = useIsClient();

  const hasErrors = !featureAvailable || errorMessage;

  if (hasErrors) {
    return (
      <IotaCallbackPageError
        featureAvailable={featureAvailable}
        errorMessage={errorMessage}
      />
    );
  }

  if (!isClient) {
    return null;
  }

  return <IotaCallbackContent responseCode={responseCode} />;
}
