"use client";

import React from "react";
import Button from "../button/button";
import { InternalLink } from "../links/links";
import WalletInfo from "./wallet-info";
import useWallet from "./use-wallet";
import { WalletStatus } from "./wrappers/wallet-wrapper";

const ConnectWallet = () => {
  const { status, connect, reconnect } = useWallet();

  React.useEffect(() => {
    reconnect();
  }, [reconnect]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      connect();
    },
    [connect]
  );

  return status === WalletStatus.CONNECTED ? (
    <WalletInfo />
  ) : (
    <InternalLink href={"/app"} onClick={handleClick}>
      <Button bordered>
        {status === WalletStatus.CONNECTING ? "Connecting..." : "Connect"}
      </Button>
    </InternalLink>
  );
};

export default ConnectWallet;
