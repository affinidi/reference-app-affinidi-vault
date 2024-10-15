import { FC } from "react";

import dynamic from "next/dynamic";

const VerificationClientSide = dynamic(
  () => import("src/components/Verification/index"),
  { ssr: false },
);


const completedVerification: FC = () => {
  return (
    <VerificationClientSide />
  );
};

export default completedVerification;
