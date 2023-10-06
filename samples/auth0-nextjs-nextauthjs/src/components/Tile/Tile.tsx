import { FC, PropsWithChildren } from "react";
import Image from "next/image";

import Box from "../Box/Box";
import { useLocalContent } from "src/lib/hooks/use-local-content";

import * as S from "./Tile.styled";

interface Props {
  text?: string;
  icon?: any;
}

const Tile: FC<Props> = ({ text, icon }: PropsWithChildren<Props>) => {
  const { country } = useLocalContent();

  return (
    <Box direction="column">
      <S.DarkCircle $isLocal={country}>
        <Box>
          <Image src={icon} alt="icon" />
        </Box>
      </S.DarkCircle>
      <S.Tile $isLocal={country}>{text}</S.Tile>
    </Box>
  );
};

export default Tile;
