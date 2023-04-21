"use client";

import { Dropdown, SelectionBehavior } from "@nextui-org/react";
import React from "react";
import IconWarning from "../icons/icon-warning";

import styles from "./wallet-network-selector.module.scss";
import { useSetChain } from "@web3-onboard/react";
import IconBNB from "../icons/icon-bnb";
import { defaultChain } from "../../web3-onboard";

const WalletNetworkSelector = () => {
  const [{ chains, connectedChain }, setChain] = useSetChain();
  const chainId = connectedChain?.id ?? '';

  const isChainSupported = React.useMemo(() => {
    return chains.some((chain) => chain.id === chainId);
  }, [chains, chainId]);

  const icon = React.useMemo(() => {
    if (!connectedChain || !isChainSupported) {
      return <IconWarning width={20} height={20} />;
    }
    return getIcon(connectedChain.id) ?? "?";
  }, [isChainSupported, connectedChain]);

  React.useEffect(() => {
    if (chainId === defaultChain.id) {
      return;
    }
    setChain({ chainId });
  }, [chains, chainId, setChain]);

  const handleSelectionChanged = React.useCallback(
    (keys: "all" | Set<string | number>) => {
      const set = keys as Set<string>;
      const [chainId] = Array.from(set);
      setChain({ chainId });
    },
    [setChain]
  );

  return (
    <Dropdown>
      <Dropdown.Button light size="sm" className={styles.network}>
        {icon}
      </Dropdown.Button>
      <Dropdown.Menu
        css={{ $$dropdownMenuWidth: "320px" }}
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[chainId]}
        onSelectionChange={handleSelectionChanged}
      >
        {chains.map((chain) => {
          return (
            <Dropdown.Item key={chain.id} icon={getIcon(chain.id)}>
              {chain.label}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

function getIcon(id: string) {
  switch (id) {
    case "0x61":
      return <IconBNB width={20} height={20} />;
    default:
      return null;
  }
}

export default WalletNetworkSelector;
