import React from "react";
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
  const text = `${vault.name} (${vault.symbol})`;
  const href = getChainExplorer(chainId);
  if (!href) {
    return <>{text}</>;
  }
  return (
    <ExternalLink
      className={styles.vaultLink}
      icon={<IconExternal />}
      iconAtEnd
      href={href + "address/" + vault.address}
    >
      {text}
    </ExternalLink>
  );
}
