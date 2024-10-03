import { FC } from "react";

import dynamic from "next/dynamic";

const CheckoutClientSide = dynamic(
  () => import("src/components/Checkout/index"),
  { ssr: false },
);


const checkout: FC = () => {
  return (
    <CheckoutClientSide/>
  );
};

export default checkout;
