"use client";

import { Dropdown } from "@nextui-org/react";
import React from "react";

import styles from "./wallet-network-selector.module.scss";
import { useWalletWrapperContext } from "../../providers/wallet/wallet-wrapper-provider";

const WalletNetworkSelector = () => {
  const { chain, chains, setCurrentChain } = useWalletWrapperContext();

  const handleSelectionChanged = React.useCallback(
    (keys: "all" | Set<string | number>) => {
      const set = keys as Set<string>;
      const [id] = Array.from(set);
      setCurrentChain(id);
    },
    [setCurrentChain]
  );

  return (
    <Dropdown>
      <Dropdown.Button light size="sm" className={styles.network}>
        {chain!.icon}
      </Dropdown.Button>
      <Dropdown.Menu
        css={{ $$dropdownMenuWidth: "320px" }}
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[chain!.id]}
        onSelectionChange={handleSelectionChanged}
      >
        {chains.map((chain) => {
          return (
            <Dropdown.Item key={chain.id} icon={chain.icon}>
              {chain.name}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default WalletNetworkSelector;
