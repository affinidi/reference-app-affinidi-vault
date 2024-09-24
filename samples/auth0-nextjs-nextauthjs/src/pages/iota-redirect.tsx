import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { personalAccessTokenConfigured } from "src/lib/env";

const IotaRedirectFlowPage = dynamic(
  () => import("../components/iota/RedirectFlowPage"),
  { ssr: false },
);

export const getServerSideProps = (async () => {
  return { props: { featureAvailable: personalAccessTokenConfigured() } };
}) satisfies GetServerSideProps<{ featureAvailable: boolean }>;

export default function Page({
  featureAvailable,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <IotaRedirectFlowPage featureAvailable={featureAvailable} />;
}
