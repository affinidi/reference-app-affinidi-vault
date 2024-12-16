import { GetServerSideProps } from "next";
import { personalAccessTokenConfigured } from "src/lib/env";
import IotaRedirectFlowPage from "./iota-redirect-flow-page";
import { useIsClient } from "@uidotdev/usehooks";

export const getServerSideProps = (async () => {
  return { props: { featureAvailable: personalAccessTokenConfigured() } };
}) satisfies GetServerSideProps<{ featureAvailable: boolean }>;

export default function Page({
  featureAvailable,
}: {
  featureAvailable: boolean;
}) {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return <IotaRedirectFlowPage featureAvailable={featureAvailable} />;
}
