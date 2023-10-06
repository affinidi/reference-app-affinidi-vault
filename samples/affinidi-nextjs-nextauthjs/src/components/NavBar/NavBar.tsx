import { FC, useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

import Box from "src/components/Box/Box";
import IconPersonFilled from "public/images/icon-person-filled.svg";

import { useAuthentication } from "src/lib/hooks/use-authentication";
import { useLocalContent } from "src/lib/hooks/use-local-content";

import * as S from "./NavBar.styled";

const NavBar: FC = () => {
  const [isSignInPage, setIsSignInPage] = useState(false);
  const [confirmLogOut, setConfirmLogOut] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuthentication();

  const { country } = useLocalContent();

  useEffect(() => {
    if (window.location.href.includes("/sign-in")) {
      setIsSignInPage(true);
    } else {
      setIsSignInPage(false);
    }
  }, []);

  useEffect(() => {
    if (confirmLogOut) {
      const timeoutId = setTimeout(() => {
        setConfirmLogOut(false);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [confirmLogOut]);

  async function handleLogOut() {
    if (!confirmLogOut) {
      setConfirmLogOut(true);
      return;
    }

    await signOut();
  }

  return (
    <S.Container
      justifyContent="space-between"
      alignItems="center"
      direction="row"
    >
      <S.Title $isLocal={country} onClick={() => (window.location.href = "/")}>
        INSURANCE
      </S.Title>

      {!isSignInPage && (
        <>
          <S.NavigationContainer
            justifyContent="space-between"
            alignItems="flex-end"
            direction="row"
            $isLocal={country}
          >
            <S.NavTabs>Home</S.NavTabs>
            <S.NavTabs>Products</S.NavTabs>
            <S.NavTabs>Service</S.NavTabs>
            <S.NavTabs>Pricing</S.NavTabs>
            <S.NavTabs>Contact Us</S.NavTabs>
          </S.NavigationContainer>

          <Box style={{ minWidth: 200 }} alignItems="end">
            {isLoading && <S.Loading $isLocal={country}>Loading...</S.Loading>}

            {!isLoading && !isAuthenticated && (
              <Box justifyContent="end" alignItems="center" direction="row">
                <S.Button
                  variant="primary"
                  onClick={() => (window.location.href = "/sign-in")}
                >
                  Log In
                </S.Button>
                <S.Button
                  variant="secondary"
                  onClick={() => (window.location.href = "/sign-in")}
                >
                  Sign Up
                </S.Button>
              </Box>
            )}

            {!isLoading && isAuthenticated && (
              <S.Account
                onClick={handleLogOut}
                direction="row"
                alignItems="center"
                justifyContent="end"
                gap={16}
              >
                {!confirmLogOut && (
                  <S.Avatar $isLocal={country}>
                    <Image src={IconPersonFilled} alt="avatar" />
                  </S.Avatar>
                )}
                <S.Email $isLocal={country}>
                  {confirmLogOut ? "Log out" : user?.email || "My Account"}
                </S.Email>
              </S.Account>
            )}
          </Box>
        </>
      )}
    </S.Container>
  );
};

export default NavBar;
