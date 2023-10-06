import Tile from "src/components/Tile/Tile";

import LocalEducationIcon from "public/images/local-education-icon.svg";
import LocalHomeScreenIcon from "public/images/local-home-screen-icon.svg";
import LocalTransportIcon from "public/images/local-transport-icon.svg";

import DebtIcon from "public/images/debt-icon.svg";
import FinanceIcon from "public/images/finance-icon.svg";
import EducationIcon from "public/images/education-icon.svg";

import { useLocalContent } from "src/lib/hooks/use-local-content";

import * as S from "./TilesSection.styled";

const TilesSection = () => {
  const { country } = useLocalContent();

  return (
    <S.TileWrapper direction="column" $isLocal={country}>
      <S.TileHeader>What’s covered?</S.TileHeader>
      <span />

      <S.TileContainer direction="row" justifyContent="space-between">
        <Tile
          text="Injuries on your property"
          icon={country ? LocalHomeScreenIcon : DebtIcon}
        />
        <Tile
          text="Damages to others’ property"
          icon={country ? LocalTransportIcon : FinanceIcon}
        />
        <Tile
          text="Lawsuits and lawyer/court fees"
          icon={country ? LocalEducationIcon : EducationIcon}
        />
      </S.TileContainer>
    </S.TileWrapper>
  );
};

export default TilesSection;
