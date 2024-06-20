import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { personalAccessTokenConfigured } from "src/lib/env";

const IotaClientPage = dynamic(
  () => import("../components/iota/IotaClientPage"),
  { ssr: false },
);

export const getServerSideProps = (async () => {
  return { props: { featureAvailable: personalAccessTokenConfigured() } };
}) satisfies GetServerSideProps<{ featureAvailable: boolean }>;

export default function Page({
  featureAvailable,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <IotaClientPage featureAvailable={featureAvailable} />;
}
