import { Session } from "next-auth";
import { getSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { hostUrl } from "src/lib/variables";
import Button from "./core/Button";

const NavBar: FC = () => {
  const [session, setSession] = useState<Session>();

  useEffect(() => {
    async function fetchSession() {
      const mySession = await getSession();
      if (!mySession) {
        console.log("Not authenticated");
        return;
      }
      setSession(mySession);
    }

    fetchSession();
  }, []);

  async function handleLogin() {
    await signIn("affinidi", { callbackUrl: hostUrl });
  }

  async function handleLogOut() {
    await signOut();
  }

  return (
    <header className="w-full shadow-md py-4">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link href="/" className="flex items-center" prefetch={false}>
          <svg width="29" height="24" viewBox="0 0 29 24" fill="none">
            <path
              d="M3.22 20.281A11.966 11.966 0 0 0 11.904 24c3.415 0 6.498-1.428 8.683-3.719H3.219h.001zM20.588 6.762H1.106A11.933 11.933 0 0 0 0 10.48h20.588V6.762zM20.586 3.719A11.966 11.966 0 0 0 11.902 0 11.966 11.966 0 0 0 3.22 3.719h17.367zM20.588 13.521H0c.167 1.319.548 2.57 1.106 3.719h19.482v-3.718zM22.703 6.762c.558 1.148.94 2.4 1.106 3.718h4.78V6.762h-5.886z"
              fill="#040822"
            />
            <path
              d="M28.586 20.281h-8V24h8V20.28zM22.703 17.24h5.886v-3.718h-4.78a11.93 11.93 0 0 1-1.106 3.718zM28.586 0h-8v3.719h8V0z"
              fill="#040822"
            />
            <path
              d="M23.807 10.48A11.931 11.931 0 0 0 22.7 6.76a12.012 12.012 0 0 0-2.115-3.041v16.563A12.045 12.045 0 0 0 22.7 17.24 11.932 11.932 0 0 0 23.9 12c0-.516-.031-1.023-.094-1.522v.001z"
              fill="#1D58FC"
            />
          </svg>
          <span className="ml-4 text-lg font-semibold">
            Affinidi Sample App
          </span>
        </Link>
        <nav className="flex space-x-8">
          <Link
            href="/credential-issuance"
            className="py-4 font-medium transition-colors hover:text-blue-500"
            prefetch={false}
          >
            Issue Credentials
          </Link>
          <Link
            href="/iota"
            className="py-4 font-medium transition-colors hover:text-blue-500"
            prefetch={false}
          >
            Receive Credentials
          </Link>
        </nav>
        {!hostUrl && <span>Affinidi Login not configured</span>}
        {session && hostUrl && (
          <div className="flex">
            <div className="flex flex-col justify-center px-4">
              <p>{session.user?.email}</p>
              {session.user?.country && <p>From: {session.user?.country}</p>}
            </div>
            <Button id="logout" onClick={handleLogOut}>
              Logout
            </Button>
          </div>
        )}
        {!session && hostUrl && (
          <button
            id="affinidiLogin"
            onClick={handleLogin}
            className="affinidi-login affinidi-login-m"
          >
            Affinidi Login
          </button>
        )}
      </div>
    </header>
  );
};

export default NavBar;
