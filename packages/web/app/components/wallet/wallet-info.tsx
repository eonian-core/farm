"use client";

import React from "react";
import Image from "next/image";

import styles from "./wallet-info.module.scss";
import { Dropdown } from "@nextui-org/react";
import WalletNetworkSelector from "./wallet-network-selector";
import { DropdownItemBaseProps } from "@nextui-org/react/types/dropdown/base/dropdown-item-base";
import { ULTRA_WIDE_SCREEN } from "../resize-hooks/screens";
import { useWindowSize } from "../resize-hooks/useWindowSize";
import useWallet from "./use-wallet";

interface Props {
  isOnApp: boolean;
  goToApp: () => void;
}

const WalletInfo: React.FC<Props> = ({ isOnApp, goToApp }) => {
  const { wallet, disconnect } = useWallet();
  const { width = 0 } = useWindowSize();
  
  const menuPlacement = React.useMemo(() => {
    const isWideScreen = width >= ULTRA_WIDE_SCREEN;
    return isWideScreen ? "bottom" : "bottom-right";
  }, [width]);

  const handleMenuClick = React.useCallback(
    (key: string | number) => {
      switch (key) {
        case "disconnect": {
          disconnect();
          break;
        }
        case "go_to_app": {
          goToApp();
          break;
        }
      }
    },
    [goToApp, disconnect]
  );

  const menuItems = React.useMemo(() => {
    type ItemType = Partial<DropdownItemBaseProps> & {
      key: string;
      text: string;
    };
    const items: ItemType[] = [
      {
        key: "disconnect",
        text: "Disconnect",
        color: "error",
        withDivider: !isOnApp,
      },
    ];
    if (!isOnApp) {
      items.unshift({
        key: "go_to_app",
        text: "Open App",
      });
    }
    return items;
  }, [isOnApp]);

  const shrinkedAddress = React.useMemo(() => shrinkAddress(wallet!.address), [wallet]);

  return (
    <div className={styles.container}>
      <WalletNetworkSelector />
      <Dropdown placement={menuPlacement}>
        <Dropdown.Button size="sm" css={{ background: "$dark" }}>
          <Image
            src={wallet!.iconImageSrc}
            alt={wallet!.label}
            width={20}
            height={20}
          />
          <span className={styles.address}>{shrinkedAddress}</span>
        </Dropdown.Button>
        <Dropdown.Menu onAction={handleMenuClick}>
          {menuItems.map(({ key, text, ...restProps }) => {
            return (
              <Dropdown.Item key={key} {...restProps}>
                {text}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

function shrinkAddress(address: string): string {
  return address.substring(0, 6) + "..." + address.slice(-4);
}

export default WalletInfo;
