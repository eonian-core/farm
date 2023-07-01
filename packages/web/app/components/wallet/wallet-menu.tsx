"use client";

import { Dropdown } from "@nextui-org/react";
import { DropdownItemBaseProps } from "@nextui-org/react/types/dropdown/base/dropdown-item-base";
import { usePathname } from "next/navigation";
import React from "react";
import useRouterPush from "../links/use-router-push";
import { ULTRA_WIDE_SCREEN } from "../resize-hooks/screens";
import { useWindowSize } from "../resize-hooks/useWindowSize";
import { useWalletWrapperContext } from "../../providers/wallet/wallet-wrapper-provider";

interface ItemType extends Partial<DropdownItemBaseProps> {
  key: string;
  text: string;
}

const enum MenuOption {
  GO_TO_EARN = "go_to_earn",
  DISCONNECT = "disconnect",
}

const EARN_ROUTE = "/earn";

interface Props {
  children: React.ReactNode;
}

export const useMenuItems = (isOnEarn: boolean): ItemType[] => React.useMemo(() => {
  const items: ItemType[] = [
    {
      key: MenuOption.DISCONNECT,
      text: "Disconnect",
      color: "error",
      withDivider: !isOnEarn,
    },
  ];

  if (!isOnEarn) {
    items.unshift({
      key: MenuOption.GO_TO_EARN,
      text: "Go to Earn",
    });
  }

  return items;
}, [isOnEarn]);

export const useOnMenuClick = () => {
  const { disconnect } = useWalletWrapperContext();
  const [push] = useRouterPush();

  return React.useCallback(
    (key: string | number) => {
      switch (key) {
        case MenuOption.DISCONNECT: {
          disconnect();
          break;
        }
        
        case MenuOption.GO_TO_EARN: {
          push(EARN_ROUTE);
          break;
        }
      }
    },
    [push, disconnect]
  );
}

const WalletMenu: React.FC<Props> = ({ children }) => {
  const { width = 0 } = useWindowSize();

  const menuPlacement = React.useMemo(() => {
    const isWideScreen = width >= ULTRA_WIDE_SCREEN;
    return isWideScreen ? "bottom" : "bottom-right";
  }, [width]);
  
  const pathname = usePathname();
  const isOnEarn = pathname.includes(EARN_ROUTE);

  const menuItems = useMenuItems(isOnEarn)
  const handleMenuClick = useOnMenuClick()

  return (
    <Dropdown placement={menuPlacement}>
      <Dropdown.Button size="sm" css={{ background: "$dark" }}>
        {children}
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
  );
};

export default WalletMenu;
