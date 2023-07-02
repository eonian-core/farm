import React from "react";
import IconBNB from "./icon-bnb";
import IconEthereum from "./icon-ethereum";
import IconBitcoin from "./icon-bitcoin";
import IconTether from "./icon-tether";

export enum CoinIcon {
  BNB = "BNB",
  ETH = "ETH",
  USDT = "USDT",
  BTC = "BTC",
}

interface Props extends React.SVGProps<SVGSVGElement> {
  symbol: CoinIcon | string;
}

const IconCoin: React.FC<Props> = ({ symbol, ...svgProps }) => {
  switch (symbol) {
    case CoinIcon.BNB:
      return <IconBNB {...svgProps} />;
    case CoinIcon.ETH:
      return <IconEthereum {...svgProps} />;
    case CoinIcon.USDT:
      return <IconTether {...svgProps} />;
    case CoinIcon.BTC:
    default:
      return <IconBitcoin {...svgProps} />;
  }
};

export default IconCoin;
