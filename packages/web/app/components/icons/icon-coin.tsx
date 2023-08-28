import React from 'react'
import IconBNB from './icon-bnb'
import IconEthereum from './icon-ethereum'
import IconBitcoin from './icon-bitcoin'
import IconTether from './icon-tether'
import IconUSDC from './icon-usdc'
import IconBUSD from './icon-busd'

export enum CoinIcon {
  BNB = 'BNB',
  ETH = 'ETH',
  USDT = 'USDT',
  BUSD = 'BUSD',
  USDC = 'USDC',
  BTC = 'BTC',
}

interface Props extends React.SVGProps<SVGSVGElement> {
  symbol: CoinIcon | string
}

const IconCoin: React.FC<Props> = ({ symbol, ...svgProps }) => {
  switch (symbol) {
    case CoinIcon.BNB:
      return <IconBNB {...svgProps} />
    case CoinIcon.ETH:
      return <IconEthereum {...svgProps} />
    case CoinIcon.USDT:
      return <IconTether {...svgProps} />
    case CoinIcon.USDC:
      return <IconUSDC {...svgProps} />
    case CoinIcon.BUSD:
      return <IconBUSD {...svgProps} />
    case CoinIcon.BTC:
    default:
      return <IconBitcoin {...svgProps} />
  }
}

export default IconCoin
