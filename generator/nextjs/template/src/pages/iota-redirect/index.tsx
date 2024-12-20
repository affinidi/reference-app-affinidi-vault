import { GetServerSideProps } from "next";
import { personalAccessTokenConfigured } from "src/lib/env";
import dynamic from "next/dynamic";

const IotaRedirectFlowPage = dynamic(
  () => import("../../components/iota/IotaRedirectFlowPage"),
  {
    ssr: false,
  }
);

export const getServerSideProps = (async () => {
  return { props: { featureAvailable: personalAccessTokenConfigured() } };
}) satisfies GetServerSideProps<{ featureAvailable: boolean }>;

export default function Page({
  featureAvailable,
}: {
  featureAvailable: boolean;
}) {
  return <IotaRedirectFlowPage featureAvailable={featureAvailable} />;
}
