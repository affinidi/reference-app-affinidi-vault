import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import NavBar from "src/components/NavBar";

import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NavBar />
        <div className="mx-auto container py-8 px-4">
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
}
