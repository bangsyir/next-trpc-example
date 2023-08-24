import "@/styles/globals.css";
import { trpc } from "@/utils/trpc";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps, AppType } from "next/app";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};
export default trpc.withTRPC(App);
