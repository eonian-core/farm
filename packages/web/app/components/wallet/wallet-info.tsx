"use client";

import React from "react";
import Image from "next/image";

import styles from "./wallet-info.module.scss";
import WalletNetworkSelector from "./wallet-network-selector";
import WalletMenu from "./wallet-menu";
import { useWalletWrapperContext } from "../../providers/wallet/wallet-wrapper-provider";

const WalletInfo = () => {
  const { wallet } = useWalletWrapperContext();

  const shrinkedAddress = React.useMemo(
    () => shrinkAddress(wallet!.address),
    [wallet]
  );

  return (
    <div className={styles.container}>
      <WalletNetworkSelector />
      <WalletMenu>
        <Image
          src={wallet!.iconImageSrc}
          alt={wallet!.label}
          width={20}
          height={20}
        />
        <span className={styles.address}>{shrinkedAddress}</span>
      </WalletMenu>
    </div>
  );
};

function shrinkAddress(address: string): string {
  return address.substring(0, 6) + "..." + address.slice(-4);
}

export default WalletInfo;
