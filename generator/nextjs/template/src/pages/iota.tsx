import dynamic from "next/dynamic";

const IotaClientPage = dynamic(
  () => import("../components/iota/IotaClientPage"),
  { ssr: false },
);

export default function Page() {
  return <IotaClientPage />;
}
