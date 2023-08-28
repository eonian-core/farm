import type { ChainId } from './helpers'

export enum WalletStatus {
  NOT_CONNECTED = 'NOT_CONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
}

export interface Chain {
  id: ChainId
  name?: string
  icon: React.ReactNode
  isDefault: boolean
  isSupported: boolean
  multicallAddress: string
}

export interface Wallet {
  label: string
  address: string
  iconImageSrc: string
}
