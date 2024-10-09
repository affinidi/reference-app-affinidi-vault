import { useState, useContext, useEffect, useRef } from "react";
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

const NavBar = () => {
  const [consumer, storeConsumerInfo] = useContext(ConsumerContext);
  const { items } = useCartContext();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
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
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
