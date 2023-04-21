"use client";

import React from "react";
import Button from "../button/button";
import { usePathname, useRouter } from "next/navigation";
import { InternalLink } from "../links/links";
import { useConnectWallet } from "@web3-onboard/react";
import WalletInfo from "./wallet-info";
import useRouterPush from "../links/use-router-push";

const APP_ROUTE = "/app";

const ConnectWallet = () => {
  const [{ wallet, connecting }, connect] = useConnectWallet();
  const [push] = useRouterPush();

  const pathname = usePathname();
  const isOnApp = pathname === APP_ROUTE;
  const isWalletConnected = wallet && wallet.accounts.length > 0;

  const goToApp = React.useCallback(() => push(APP_ROUTE), [push]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      !isOnApp ? goToApp() : connect();
    },
    [connect, goToApp, isOnApp]
  );

  return isWalletConnected ? (
    <WalletInfo isOnApp={isOnApp} goToApp={goToApp} />
  ) : (
    <InternalLink href={"/app"} onClick={handleClick}>
      <Button bordered>
        {isOnApp ? (connecting ? "Connecting..." : "Connect") : "Launch App"}
      </Button>
    </InternalLink>
  );
};

export default ConnectWallet;
