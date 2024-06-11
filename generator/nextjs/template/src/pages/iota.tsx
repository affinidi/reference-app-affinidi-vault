import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { SelectOption } from "src/components/core/Select";
import { listIotaConfigurations } from "src/lib/clients/iota";

const IotaClientPage = dynamic(
  () => import("../components/iota/IotaClientPage"),
  { ssr: false }
);

export const getServerSideProps = (async () => {
  const iotaConfigurations = await listIotaConfigurations();
  const configOptions = iotaConfigurations.map((config) => ({
    label: config.name,
    value: config.configurationId,
  }));
  return { props: { configOptions } };
}) satisfies GetServerSideProps<{ configOptions: SelectOption[] }>;

export default function Page({
  configOptions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(configOptions);
  return <IotaClientPage configOptions={configOptions} />;
}
