import { FC } from "react";
import dynamic from "next/dynamic";

const ProfileOptionsClientSide = dynamic(
  () => import("src/components/ProfileOptions/index"),
  { ssr: false },
);

const preference: FC = () => {
  return (
    <ProfileOptionsClientSide/>
  );
};

export default preference;
