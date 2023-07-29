import { Badge } from "@nextui-org/react";
import React from "react";
import { Vault } from "../../../api";
import { toStringNumberFromDecimals } from "../../../shared";

import styles from "./vault-tags-cell.module.scss";

interface Props {
  vault: Vault;
}

const TVL_THRESHOLD = 1e4;

export const VaultTagsCell: React.FC<Props> = ({ vault }) => {
  const currentTVL = +toStringNumberFromDecimals(
    vault.fundAssetsUSD,
    vault.asset.price.decimals
  );
  return (
    <div className={styles.container}>
      {currentTVL < TVL_THRESHOLD && (
        <Badge
          color="primary"
          variant="bordered"
          disableOutline
          className={styles.badgeBordered}
        >
          New
        </Badge>
      )}
      <Badge variant="flat" disableOutline>
        VFT
      </Badge>
      <Badge variant="flat" disableOutline>
        Stable
      </Badge>
    </div>
  );
};
