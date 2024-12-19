import { GetStaticProps } from "next";
import { personalAccessTokenConfigured } from "src/lib/env";
import { useSearchParams } from "next/navigation";
import IotaCallbackPageError from "./iota-callback-error";
import { useIsClient } from "@uidotdev/usehooks";
import dynamic from "next/dynamic";

const IotaCallbackContent = dynamic(
  () => import("../../components/iota/IotaCallbackContent"),
  {
    ssr: false,
  }
);

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

  const hasErrors = !featureAvailable || errorMessage;

  if (hasErrors) {
    return (
      <IotaCallbackPageError
        featureAvailable={featureAvailable}
        errorMessage={errorMessage}
      />
    );
  }

  return <IotaCallbackContent responseCode={responseCode} />;
}
