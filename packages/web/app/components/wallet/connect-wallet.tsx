"use client";

import React from "react";
import Button from "../button/button";
import { usePathname, useRouter } from "next/navigation";
import { InternalLink } from "../links/links";
import WalletInfo from "./wallet-info";
import useRouterPush from "../links/use-router-push";
import useWallet, { WalletStatus } from "./use-wallet";

const APP_ROUTE = "/app";

const ConnectWallet = () => {
  const { status, connect, reconnect } = useWallet();
  const [push] = useRouterPush();

  const pathname = usePathname();
  const isOnApp = pathname === APP_ROUTE;

  const goToApp = React.useCallback(() => push(APP_ROUTE), [push]);

  React.useEffect(() => {
    reconnect();
  }, [reconnect]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      !isOnApp ? goToApp() : connect();
    },
    [connect, goToApp, isOnApp]
  );

  return status === WalletStatus.CONNECTED ? (
    <WalletInfo isOnApp={isOnApp} goToApp={goToApp} />
  ) : (
    <InternalLink href={"/app"} onClick={handleClick}>
      <Button bordered>
        {isOnApp
          ? status === WalletStatus.CONNECTING
            ? "Connecting..."
            : "Connect"
          : "Launch App"}
      </Button>
    </InternalLink>
  );
};

export default ConnectWallet;
