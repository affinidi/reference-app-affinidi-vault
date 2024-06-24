import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import NavBar from "src/components/NavBar";

import "../styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider>
      <NavBar />
      <div className="mx-auto container py-8 px-4">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
