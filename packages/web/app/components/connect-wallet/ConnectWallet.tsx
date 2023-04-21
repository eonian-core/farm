"use client";

import React from "react";
import Button from "../button/button";
import { usePathname } from "next/navigation";
import { InternalLink } from "../links/links";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { defaultChain } from "../../web3-onboard";

const ConnectWallet = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain }, setChain] = useSetChain();

  const pathname = usePathname();
  const isOnApp = pathname === "/app";

  React.useEffect(() => {
    const { id: chainId } = defaultChain;
    if (!wallet || connectedChain?.id === chainId) {
      return;
    }
    setChain({ chainId });
  }, [chains, wallet, connectedChain, setChain]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (!isOnApp) {
        // Just handle the link navigation
        return;
      }
      event.preventDefault();
      wallet ? disconnect(wallet) : connect();
    },
    [connect, disconnect, isOnApp, wallet]
  );

  return (
    <div>
      <InternalLink href={"/app"} onClick={handleClick}>
        <Button bordered>
          {isOnApp
            ? connecting
              ? "Connecting..."
              : wallet
              ? "Disconnect"
              : "Connect"
            : "Launch App"}
        </Button>
      </InternalLink>
    </div>
  );
};

export default ConnectWallet;
