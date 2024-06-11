import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";

const IotaClientPage = dynamic(
  () => import("../components/iota/IotaClientPage"),
  { ssr: false }
);

export const getServerSideProps = (async () => {
  return { props: { did: "" } };
}) satisfies GetServerSideProps<{
  did: string | undefined;
}>;

export default function Page({
  did,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <IotaClientPage />;
}
