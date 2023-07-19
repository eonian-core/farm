import React from "react";
import { Vault } from "../../../api";
import IconCoin from "../../../components/icons/icon-coin";
import { CellWithDescription } from "./cell-with-description";

interface Props {
  vault: Vault;
}

export const VaultNameCell: React.FC<Props> = ({ vault }) => (
  <CellWithDescription
    icon={
      <IconCoin symbol={vault.asset.symbol} width="1.75em" height="1.75em" />
    }
    description={vault.name}
  >
    {vault.asset.symbol}
  </CellWithDescription>
);
