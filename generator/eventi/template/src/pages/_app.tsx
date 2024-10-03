import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { theme } from "src/styles/theme";
import "../styles/globals.css";
import { CartProvider } from "src/lib/context/CartContext";
import {
  GeoContext,
  GeoDefaultValue,
  GeoInfo,
} from "src/lib/context/GeoContext";
import {
  ConsumerContext,
  ConsumerInfoProps,
  ConsumerInfoValue,
} from "src/lib/context/ConsumerContext";
import stringSimilarity from "string-similarity";
import { geographies } from "src/lib/constants/geographies";
import dynamic from "next/dynamic";
import { getAuthInfo } from "src/lib/utils/getAuthInfo";

const NavBarClientSide = dynamic(() => import("src/components/NavBar/index"), {
  ssr: false,
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [consumerInfo, setConsumerInfo] =
    useState<ConsumerInfoProps>(ConsumerInfoValue);
  const router = useRouter();
  const [userLoading, setUserLoading] = useState(false);
  const [geo, setGeo] = useState<GeoInfo>(GeoDefaultValue);

  useEffect(() => {
    const getLoggedInUser = async () => {
      setUserLoading(true);
      const loggedInUser = await getAuthInfo();
      if (loggedInUser && loggedInUser.user && loggedInUser.userId) {
        setConsumerInfo((prev) => ({
          ...prev,
          user: loggedInUser.user,
          userId: loggedInUser.userId,
        }));
      }
      setUserLoading(false);
    };

    const consumerCurrentState = localStorage.getItem("consumerCurrentState");
    if (consumerCurrentState) {
      setConsumerInfo((prev) => JSON.parse(consumerCurrentState));
    } else {
      getLoggedInUser();
    }
  }, []);

  useEffect(() => {
    const consumerCurrentGeo = localStorage.getItem("consumerGeo");
    if (consumerCurrentGeo) {
      setGeo(JSON.parse(consumerCurrentGeo));
    }
  }, []);

  useEffect(() => {
    if (!consumerInfo.userId) return;

    if (consumerInfo.user) {
      storeConsumerInfo(consumerInfo);
    }

    if (consumerInfo.user && consumerInfo.user.country) {
      const consumerCountry = consumerInfo.user.country;

      const matches = stringSimilarity.findBestMatch(
        consumerCountry,
        geographies.map((c) => c.name)
      );
      const finalCountry = geographies.find(
        (c) => c.name === matches.bestMatch.target
      );

      // Either the country user selected or default
      if (finalCountry) {
        storeGeo({
          name: finalCountry.name,
          currency: finalCountry.currency,
          currencyRate: finalCountry.currencyRate,
          currencySymbol: finalCountry.currencySymbol,
        });
      }
    } else {
      storeGeo({
        name: geo.name,
        currency: geo.currency,
        currencyRate: geo.currencyRate,
        currencySymbol: geo.currencySymbol,
      });
    }
  }, [consumerInfo]);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/cart");
    router.prefetch("/checkout");
    router.prefetch("/signup");
    router.prefetch("/preferences");
    router.prefetch("/signupnext");
  }, [router]);

  const storeGeo: Dispatch<SetStateAction<GeoInfo>> = (
    newGeo: SetStateAction<GeoInfo>
  ) => {
    setGeo((prevState) => {
      const updatedGeo =
        typeof newGeo === "function" ? newGeo(prevState) : newGeo;
      localStorage.setItem("consumerGeo", JSON.stringify(updatedGeo));
      return updatedGeo;
    });
  };

  const storeConsumerInfo: Dispatch<SetStateAction<ConsumerInfoProps>> = (
    newConsumer: SetStateAction<ConsumerInfoProps>
  ) => {
    setConsumerInfo((prevState) => {
      const updatedConsumer =
        typeof newConsumer === "function"
          ? newConsumer(prevState)
          : newConsumer;
      localStorage.setItem(
        "consumerCurrentState",
        JSON.stringify(updatedConsumer)
      );
      return updatedConsumer;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <ConsumerContext.Provider value={[consumerInfo, storeConsumerInfo]}>
        <GeoContext.Provider value={[geo, storeGeo]}>
          <CartProvider>
            <NavBarClientSide />
            <Component {...pageProps} />
          </CartProvider>
        </GeoContext.Provider>
      </ConsumerContext.Provider>
    </ThemeProvider>
  );
}
