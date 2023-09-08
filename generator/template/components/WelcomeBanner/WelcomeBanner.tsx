import { FC, useState } from "react";
import Image from "next/image";

import { useExtension } from "hooks/useExtension";
import Box from "components/Box/Box";

import close from "assets/close.png";
import GermanFlagIcon from "public/images/german-flag.svg";

import * as S from "./WelcomeBanner.styled";
import { useLocalContent } from "../../hooks/useLocalContent";

const WelcomeBanner: FC = () => {
  const { isInitializing } = useExtension();
  const [isClosed, setIsClosed] = useState(false);

  const { country } = useLocalContent();

  if (isClosed || isInitializing) return null;

  return (
    <S.BannerContainer>
      <S.Banner direction="row">
        <Box
          direction="row"
          justifyContent="flex-start"
          flex={2}
          alignItems="center"
        >
          {country.toLowerCase().includes("germany") && (
            <Image
              src={GermanFlagIcon.src}
              alt="german flag"
              width={32}
              height={32}
            />
          )}
          <S.BannerTitle>Welcome to our {country} website</S.BannerTitle>
        </Box>

        <S.CloseButton
          justifyContent="flex-end"
          onClick={() => setIsClosed(true)}
        >
          <Image src={close.src} alt="close" width={12} height={12} />
        </S.CloseButton>
      </S.Banner>
    </S.BannerContainer>
  );
};

export default WelcomeBanner;
