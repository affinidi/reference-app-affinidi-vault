import { useState, useContext, useEffect, useRef } from "react";
import { clientLogin } from "src/lib/auth/client-login";
import {
  ConsumerContext,
  ConsumerInfoProps,
} from "src/lib/context/ConsumerContext";
import { useCartContext } from "src/lib/context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTicket,
  faSearch,
  faIcons,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";
import * as S from "./NavBar.styled";
import { useRouter } from "next/router";
import { GeoContext } from "src/lib/context/GeoContext";
import { iotaConfigId, addressIota } from "src/lib/variables";
import useIotaQuery from "src/lib/hooks/useIotaQuery";

const NavBar = () => {
  const [consumer, storeConsumerInfo] = useContext(ConsumerContext);
  const { items } = useCartContext();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropLocationDownRef = useRef<HTMLDivElement>(null);
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const { clearCart } = useCartContext();
  const [addressAsk, setAddressAsk] = useState("");
  const [geo] = useContext(GeoContext);
  const [isLoading, setIsLoading] = useState(false);

  const { handleInitiate: handleInitiate, data: vaultData } = useIotaQuery({
    configurationId: iotaConfigId,
    queryId: addressIota,
  });

  const handleLogin = () => {
    localStorage.removeItem("shopping-app-cart");
    localStorage.removeItem("consumerCurrentState");
    clientLogin();
  };
  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };
  const handleLocationDropdownToggle = () => {
    setShowLocationDrop(!showLocationDrop);
  };

  const handleSignup = () => {
    router.push("/signup");
  };
  const gotoCart = () => {
    router.push("/cart");
  };

  const goToCheckout = () => {
    router.push("/checkout");
  };

  const goToProfile = () => {
    router.push("/preferences");
  };
  const handleLogout = () => {
    localStorage.removeItem("location");
    localStorage.removeItem("favoriteGenre");
    localStorage.removeItem("consumerGeo");
    localStorage.removeItem("consumerCurrentState");
    localStorage.removeItem("customCategorySelected");
    clearCart();
    document.cookie =
      "setting=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    signOut({
      callbackUrl: "/",
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        dropLocationDownRef.current &&
        !dropLocationDownRef.current.contains(event.target as Node)
      ) {
        setShowLocationDrop(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (vaultData) {
      const obj = "" + localStorage.getItem("consumerCurrentState");
      console.log("Inside NavBar" + vaultData);
      console.log(vaultData);
      let userUpd: ConsumerInfoProps = JSON.parse(obj);
      vaultData.formatted = vaultData.formatted
        ? vaultData.formatted
        : userUpd?.user.address;
      vaultData.postalCode = vaultData.postalCode
        ? vaultData.postalCode
        : userUpd?.user.postalCode;
      vaultData.country = vaultData.country
        ? vaultData.country
        : userUpd?.user.country;
      vaultData.locality = vaultData.locality
        ? vaultData.locality
        : userUpd?.user.city;
      vaultData.gender = vaultData.gender
        ? vaultData.gender
        : userUpd?.user.gender;
      vaultData.birthdate = vaultData.birthdate
        ? vaultData.birthdate
        : userUpd?.user.birthdate;

      const usernew = {
        ...userUpd?.user,
        address: vaultData.formatted,
        postalCode: vaultData.postalCode,
        country: vaultData.country,
        city: vaultData.locality,
        gender: vaultData.gender,
        birthdate: vaultData.birthdate,
      };

      storeConsumerInfo((prev) => ({ ...prev, user: usernew }));
      setIsLoading(false);
    }
  }, [addressAsk, vaultData]);

  const handleAddressAsk = () => {
    setAddressAsk("Yes Change");
    setIsLoading(true);
    handleInitiate();
  };

  return (
    <S.TopContainer>
      <FontAwesomeIcon icon={faIcons} className="text-[35px] mt-5 px-4" />
      <S.Title href="/"> Eventi</S.Title>

      <S.Spacer />

      {consumer.userId && (
        <S.ProfileBar>
          <S.ProfileBarItem>
            <S.ProfileBarItemDiv
              className="relative cursor-pointer"
              onClick={handleDropdownToggle}
            >
              Hello, {consumer?.user?.givenName || consumer?.user?.email}
            </S.ProfileBarItemDiv>
          </S.ProfileBarItem>
          <S.ProfileBarItem
            className="relative cursor-pointer"
            onClick={handleDropdownToggle}
            ref={dropdownRef}
          >
            <FontAwesomeIcon icon={faGear} className="text-[10px] mt-2" />
            {showDropdown && (
              <S.DropDownBar>
                <S.DropDownItemCustom
                  onClick={goToProfile}
                  className="hover:bg-gray-200 hover:rounded-md mt-1 mr-2 pt-2"
                >
                  Your Profile
                </S.DropDownItemCustom>
                <S.DropDownItemCustom className="hover:bg-gray-200 hover:rounded-md mt-1 mr-2 pt-2">
                  Orders
                </S.DropDownItemCustom>
                <S.DropDownItemCustom className="hover:bg-gray-200 hover:rounded-md mt-1 mr-2 pt-2">
                  Membership
                </S.DropDownItemCustom>
                <S.DropDownItemCustom className="hover:bg-gray-200 hover:rounded-md mt-1 mr-2 pt-2">
                  Your Recommendations
                </S.DropDownItemCustom>
                <S.DropDownItemCustom
                  className="hover:bg-gray-200 hover:rounded-md mt-1 mr-2 pt-2"
                  onClick={() => (window.location.href = "/verification")}
                >
                  Ticket Verification
                </S.DropDownItemCustom>
                <S.DropDownItemCustom
                  onClick={handleLogout}
                  className="hover:bg-gray-200 hover:rounded-md mt-1 mr-2 pt-2 mb-3"
                >
                  Logout
                </S.DropDownItemCustom>
              </S.DropDownBar>
            )}
          </S.ProfileBarItem>
        </S.ProfileBar>
      )}

      {consumer.userId && (
        <S.CartContainer onClick={goToCheckout}>
          <FontAwesomeIcon
            icon={faTicket}
            className="text-[25px] mt-2.5 px-3"
          />
          {items.length >= 0 && (
            <div>
              <p>{items.reduce((total, cart) => total + cart.quantity, 0)}</p>
            </div>
          )}
        </S.CartContainer>
      )}
    </S.TopContainer>
  );
};

export default NavBar;
