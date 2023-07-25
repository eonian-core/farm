import { Row } from "@nextui-org/react";
import React from "react";
import { Vault } from "../../../api";
import { CellWithCurrency } from "./cell-with-currency";

interface Props {
  vault: Vault;
}

export const VaultTVLCell: React.FC<Props> = ({ vault }) => (
  <CellWithCurrency
    value={vault.fundAssets}
    decimals={vault.asset.decimals}
    valueUSD={vault.fundAssetsUSD}
    decimalsUSD={vault.asset.price.decimals!}
    symbol={vault.asset.symbol}
  />
);
