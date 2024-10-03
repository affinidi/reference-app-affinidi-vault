import { allCategories, allProducts } from "src/lib/constants/shopComponents";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import * as S from "./index.styled";
import {
  ConsumerContext,
  ConsumerInfoProps,
} from "src/lib/context/ConsumerContext";
import ProductDisplay from "../ProductDisplay";
import { iotaConfigId, recommendationIota } from "src/lib/variables";
import { clientLogin } from "src/lib/auth/client-login";
import useIotaQuery from "src/lib/hooks/useIotaQuery";

const Home = () => {
  const [consumer, storeConsumerInfo] = useContext(ConsumerContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [productsToDisplay, setProductsToDisplay] = useState(allProducts);
  const [hasItem, setHasItem] = useState(false);

  //Start of Iota Request
  // const {
  //   handleInitiate,
  //   data: iotaRequestData,
  // } = useIotaQuery({ configurationId: iotaConfigId });

  // useEffect(() => {
  //   if (!iotaRequestData) return;

  //   //data for recommendations
  //   const musicData = iotaRequestData[recommendationIota];
  //   if (musicData) {
  //     const obj = "" + localStorage.getItem("consumerCurrentState");
  //     let userUpd: ConsumerInfoProps = JSON.parse(obj);
  //     const usernew = {
  //       ...userUpd?.user,
  //       interest: musicData.categories?.behaviors.interests[0].interest,
  //       genre: musicData.categories?.music.favoriteGenres[0].favoriteGenre,
  //     };
  //     filterProducts(usernew.genre);

  //     storeConsumerInfo((prev) => ({ ...prev, user: usernew }));
  //     setHasItem(true);
  //   }
  // }, [iotaRequestData]);
  //EOD of Iota Request

  const handleInitiateRecommendations = () => {
    //handleInitiate(recommendationIota)
  };


  useEffect(() => {
    if (consumer?.userId) {
      LoadRecommendations();
    }
  }, [consumer]);

  useEffect(() => {
    const customCategorySelected = localStorage.getItem(
      "customCategorySelected"
    );
    if (customCategorySelected) {
      setSelectedCategory("For Me");
      LoadRecommendations();
    }
  }, [consumer]);

  //Login Handler
  const handleLogin = () => {
    localStorage.removeItem("shopping-app-cart");
    localStorage.removeItem("consumerCurrentState");
    clientLogin();
  };

  //Category Handler
  const handleCategorySelection = (category: string) => {
    localStorage.removeItem("customCategorySelected");
    if (category === "For Me") {
      LoadRecommendations();
    } else {
      setProductsToDisplay(allProducts);
    }
    setSelectedCategory(category);
  };

  const LoadRecommendations = () => {
    const favoriteGenre = consumer.user?.genre;
    const interest = consumer.user?.interest;
    if (favoriteGenre && interest) {
      setHasItem(true);
      filterProducts(favoriteGenre);
      setSelectedCategory("For Me");
    } else {
      setProductsToDisplay(allProducts);
    }
  };

  const filterProducts = (favoriteGenre: string) => {
    const filtered = allProducts.filter((product) => {
      const matchesGenre = favoriteGenre
        ? product.genre.includes(favoriteGenre)
        : true;
      return matchesGenre;
    });

    setProductsToDisplay(filtered);
  };

  return (
    <S.Wrapper>
      {/* Login Button Container */}
      {!consumer.userId && (
        <div className="flex flex-wrap px-30">
          <div className="container w-1/2 relative">
            <S.BannerContainer>
              <S.HomeBanner>
                Got Plans?
                <br />
                {`We've got events that you'll love!`}
              </S.HomeBanner>
              <p>
                Your next best outing is waiting. And we have the tickets.
                <br />
                Log in with Affinidi to get started.
              </p>
              <S.ButtonContainer>
                <S.LoginButton onClick={handleLogin}>
                  Affinidi Login
                </S.LoginButton>
              </S.ButtonContainer>
            </S.BannerContainer>
          </div>
          <div className="container w-1/2 relative text-right">
            <S.BannerImgContainer src="/images/homepage_banner.svg" />
          </div>
        </div>
      )}

      {/* Post Login Container - Display events */}
      {consumer.userId && (
        <div className="block justify-center mx-auto">
          <S.BannerRecoWrapper>
            <div
              className="container w-1/2"
              style={{ paddingLeft: "5rem", paddingTop: "5rem" }}
            >
              <h2 style={{ fontSize: "32px" }}>
                Unsure of which events to go for?
              </h2>
              <h2 style={{ fontSize: "32px" }}>Let us help you.</h2>
              <p>
                We’ll need access to your preferences and your event history to
                give you the best recommendations.
              </p>
              <S.AffinidiIotaButtonContainer>
                <S.AffinidiIotaButton
                  onClick={() =>
                    handleInitiateRecommendations()
                  }
                >
                  Give Me Recommendations
                </S.AffinidiIotaButton>
              </S.AffinidiIotaButtonContainer>
            </div>
          </S.BannerRecoWrapper>
          <div
            className="flex flex-wrap justify-left mx-auto pt-2 px-30"
            style={{ width: "100%", marginTop: "-12rem" }}
          >
            <div className="pt-2 px-30 pl-28 pr-28">
              <p style={{ fontSize: "32px", fontWeight: "500" }}>
                Our International Events...
              </p>
            </div>
          </div>
          <div
            className="flex flex-wrap justify-left mx-auto pt-2 px-30"
            style={{ width: "100%" }}
          >
            <S.TopOptions style={{ width: "100%" }}>
              <div className="flex flex-wrap mx-auto pt-2 px-30 pl-28 pr-28">
                <ol className="space-x-12">
                  {
                    <li
                      style={{ color: "#1C58FC" }}
                      className={`hover:cursor-pointer ${
                        selectedCategory === "For Me" ? "text-red-700" : ""
                      }`}
                      onClick={() => handleCategorySelection("For Me")} // Ensure "For You" is clickable
                    >
                      {hasItem && (
                        <div>
                          For You
                          <FontAwesomeIcon
                            icon={faStar}
                            className="text-[10px]"
                            style={{ color: "dark-orange" }}
                          />
                        </div>
                      )}
                    </li>
                  }
                  {allCategories.map((category, index) => (
                    <li
                      key={index}
                      className={`hover:cursor-pointer ${
                        selectedCategory === category
                          ? "text-orange-500 font-bold"
                          : "text-gray-700"
                      }`} // Apply orange color and bold font to selected item
                      onClick={() => handleCategorySelection(category)}
                    >
                      {category}
                    </li>
                  ))}
                </ol>
              </div>
            </S.TopOptions>
          </div>
          <div className="flex flex-wrap justify-center mx-auto pt-2 px-30 pl-28 pr-28">
            {productsToDisplay.map((product, index) => (
              <ProductDisplay key={index} product={product} />
            ))}
          </div>
        </div>
      )}
    </S.Wrapper>
  );
};

export default Home;
