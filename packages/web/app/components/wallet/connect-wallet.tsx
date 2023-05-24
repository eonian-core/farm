"use client";

import React from "react";
import Button from "../button/button";
import { InternalLink } from "../links/links";
import WalletInfo from "./wallet-info";
import { WalletStatus } from "../../providers/wallet/wrappers/wallet-wrapper";
import { useWalletWrapperContext } from "../../providers/wallet/wallet-wrapper-provider";

const ConnectWallet = () => {
  const { status, connect } = useWalletWrapperContext();

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
