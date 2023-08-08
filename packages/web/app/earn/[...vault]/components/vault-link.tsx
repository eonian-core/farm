"use client";
import React from "react";
import { Tooltip } from "@nextui-org/react";
import { Vault } from "../../../api";
import IconExternal from "../../../components/icons/icon-external";
import ExternalLink from "../../../components/links/external-link";
import {
  ChainId,
  getChainExplorer,
} from "../../../providers/wallet/wrappers/helpers";
import styles from './vault-link.module.scss'

interface Props {
  vault: Vault;
  chainId: ChainId;
}

export function VaultLink({ vault, chainId }: Props) {
  const href = getChainExplorer(chainId);
  if (!href) 
    return <VaultLinkContent vault={vault} />;
  
  return (
    <ExternalLink
      className={styles.vaultLink}
      icon={<IconExternal />}
      iconAtEnd
      href={href + "address/" + vault.address}
    >
      <VaultLinkContent vault={vault} />
    </ExternalLink>
  );
}

export const VaultLinkContent = ({vault}: {vault: Vault}) => (
  <Tooltip content={`${vault.name} (${vault.symbol})`}>
    Vault Smart Contract
  </Tooltip>
)