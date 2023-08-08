/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: string;
  BigInt: bigint;
  Bytes: string;
  /**
   * 8 bytes signed integer
   *
   */
  Int8: number;
};

export type AdminChanged = {
  __typename?: 'AdminChanged';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  newAdmin: Scalars['Bytes'];
  previousAdmin: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type AdminChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AdminChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  newAdmin?: InputMaybe<Scalars['Bytes']>;
  newAdmin_contains?: InputMaybe<Scalars['Bytes']>;
  newAdmin_gt?: InputMaybe<Scalars['Bytes']>;
  newAdmin_gte?: InputMaybe<Scalars['Bytes']>;
  newAdmin_in?: InputMaybe<Array<Scalars['Bytes']>>;
  newAdmin_lt?: InputMaybe<Scalars['Bytes']>;
  newAdmin_lte?: InputMaybe<Scalars['Bytes']>;
  newAdmin_not?: InputMaybe<Scalars['Bytes']>;
  newAdmin_not_contains?: InputMaybe<Scalars['Bytes']>;
  newAdmin_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<AdminChanged_Filter>>>;
  previousAdmin?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_contains?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_gt?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_gte?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_in?: InputMaybe<Array<Scalars['Bytes']>>;
  previousAdmin_lt?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_lte?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_not?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_not_contains?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum AdminChanged_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  NewAdmin = 'newAdmin',
  PreviousAdmin = 'previousAdmin',
  TransactionHash = 'transactionHash'
}

export type Approval = {
  __typename?: 'Approval';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  owner: Scalars['Bytes'];
  spender: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
  value: Scalars['BigInt'];
};

export type Approval_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Approval_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Approval_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  spender?: InputMaybe<Scalars['Bytes']>;
  spender_contains?: InputMaybe<Scalars['Bytes']>;
  spender_gt?: InputMaybe<Scalars['Bytes']>;
  spender_gte?: InputMaybe<Scalars['Bytes']>;
  spender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  spender_lt?: InputMaybe<Scalars['Bytes']>;
  spender_lte?: InputMaybe<Scalars['Bytes']>;
  spender_not?: InputMaybe<Scalars['Bytes']>;
  spender_not_contains?: InputMaybe<Scalars['Bytes']>;
  spender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  value?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Approval_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Owner = 'owner',
  Spender = 'spender',
  TransactionHash = 'transactionHash',
  Value = 'value'
}

export type AuthorizedOperator = {
  __typename?: 'AuthorizedOperator';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  operator: Scalars['Bytes'];
  tokenHolder: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type AuthorizedOperator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AuthorizedOperator_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator?: InputMaybe<Scalars['Bytes']>;
  operator_contains?: InputMaybe<Scalars['Bytes']>;
  operator_gt?: InputMaybe<Scalars['Bytes']>;
  operator_gte?: InputMaybe<Scalars['Bytes']>;
  operator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator_lt?: InputMaybe<Scalars['Bytes']>;
  operator_lte?: InputMaybe<Scalars['Bytes']>;
  operator_not?: InputMaybe<Scalars['Bytes']>;
  operator_not_contains?: InputMaybe<Scalars['Bytes']>;
  operator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<AuthorizedOperator_Filter>>>;
  tokenHolder?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_contains?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_gt?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_gte?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tokenHolder_lt?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_lte?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_not?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_not_contains?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum AuthorizedOperator_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Operator = 'operator',
  TokenHolder = 'tokenHolder',
  TransactionHash = 'transactionHash'
}

export type BeaconUpgraded = {
  __typename?: 'BeaconUpgraded';
  beacon: Scalars['Bytes'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type BeaconUpgraded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BeaconUpgraded_Filter>>>;
  beacon?: InputMaybe<Scalars['Bytes']>;
  beacon_contains?: InputMaybe<Scalars['Bytes']>;
  beacon_gt?: InputMaybe<Scalars['Bytes']>;
  beacon_gte?: InputMaybe<Scalars['Bytes']>;
  beacon_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beacon_lt?: InputMaybe<Scalars['Bytes']>;
  beacon_lte?: InputMaybe<Scalars['Bytes']>;
  beacon_not?: InputMaybe<Scalars['Bytes']>;
  beacon_not_contains?: InputMaybe<Scalars['Bytes']>;
  beacon_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<BeaconUpgraded_Filter>>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum BeaconUpgraded_OrderBy {
  Beacon = 'beacon',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  TransactionHash = 'transactionHash'
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type BorrowerDebtManagementReported = {
  __typename?: 'BorrowerDebtManagementReported';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  borrower: Scalars['Bytes'];
  debtPayment: Scalars['BigInt'];
  freeFunds: Scalars['BigInt'];
  fundsGiven: Scalars['BigInt'];
  fundsTaken: Scalars['BigInt'];
  id: Scalars['Bytes'];
  loss: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type BorrowerDebtManagementReported_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BorrowerDebtManagementReported_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  borrower?: InputMaybe<Scalars['Bytes']>;
  borrower_contains?: InputMaybe<Scalars['Bytes']>;
  borrower_gt?: InputMaybe<Scalars['Bytes']>;
  borrower_gte?: InputMaybe<Scalars['Bytes']>;
  borrower_in?: InputMaybe<Array<Scalars['Bytes']>>;
  borrower_lt?: InputMaybe<Scalars['Bytes']>;
  borrower_lte?: InputMaybe<Scalars['Bytes']>;
  borrower_not?: InputMaybe<Scalars['Bytes']>;
  borrower_not_contains?: InputMaybe<Scalars['Bytes']>;
  borrower_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  debtPayment?: InputMaybe<Scalars['BigInt']>;
  debtPayment_gt?: InputMaybe<Scalars['BigInt']>;
  debtPayment_gte?: InputMaybe<Scalars['BigInt']>;
  debtPayment_in?: InputMaybe<Array<Scalars['BigInt']>>;
  debtPayment_lt?: InputMaybe<Scalars['BigInt']>;
  debtPayment_lte?: InputMaybe<Scalars['BigInt']>;
  debtPayment_not?: InputMaybe<Scalars['BigInt']>;
  debtPayment_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  freeFunds?: InputMaybe<Scalars['BigInt']>;
  freeFunds_gt?: InputMaybe<Scalars['BigInt']>;
  freeFunds_gte?: InputMaybe<Scalars['BigInt']>;
  freeFunds_in?: InputMaybe<Array<Scalars['BigInt']>>;
  freeFunds_lt?: InputMaybe<Scalars['BigInt']>;
  freeFunds_lte?: InputMaybe<Scalars['BigInt']>;
  freeFunds_not?: InputMaybe<Scalars['BigInt']>;
  freeFunds_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundsGiven?: InputMaybe<Scalars['BigInt']>;
  fundsGiven_gt?: InputMaybe<Scalars['BigInt']>;
  fundsGiven_gte?: InputMaybe<Scalars['BigInt']>;
  fundsGiven_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundsGiven_lt?: InputMaybe<Scalars['BigInt']>;
  fundsGiven_lte?: InputMaybe<Scalars['BigInt']>;
  fundsGiven_not?: InputMaybe<Scalars['BigInt']>;
  fundsGiven_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundsTaken?: InputMaybe<Scalars['BigInt']>;
  fundsTaken_gt?: InputMaybe<Scalars['BigInt']>;
  fundsTaken_gte?: InputMaybe<Scalars['BigInt']>;
  fundsTaken_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundsTaken_lt?: InputMaybe<Scalars['BigInt']>;
  fundsTaken_lte?: InputMaybe<Scalars['BigInt']>;
  fundsTaken_not?: InputMaybe<Scalars['BigInt']>;
  fundsTaken_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loss?: InputMaybe<Scalars['BigInt']>;
  loss_gt?: InputMaybe<Scalars['BigInt']>;
  loss_gte?: InputMaybe<Scalars['BigInt']>;
  loss_in?: InputMaybe<Array<Scalars['BigInt']>>;
  loss_lt?: InputMaybe<Scalars['BigInt']>;
  loss_lte?: InputMaybe<Scalars['BigInt']>;
  loss_not?: InputMaybe<Scalars['BigInt']>;
  loss_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<BorrowerDebtManagementReported_Filter>>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum BorrowerDebtManagementReported_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Borrower = 'borrower',
  DebtPayment = 'debtPayment',
  FreeFunds = 'freeFunds',
  FundsGiven = 'fundsGiven',
  FundsTaken = 'fundsTaken',
  Id = 'id',
  Loss = 'loss',
  TransactionHash = 'transactionHash'
}

export type Burned = {
  __typename?: 'Burned';
  amount: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  data: Scalars['Bytes'];
  from: Scalars['Bytes'];
  id: Scalars['Bytes'];
  operator: Scalars['Bytes'];
  operatorData: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type Burned_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  and?: InputMaybe<Array<InputMaybe<Burned_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  data?: InputMaybe<Scalars['Bytes']>;
  data_contains?: InputMaybe<Scalars['Bytes']>;
  data_gt?: InputMaybe<Scalars['Bytes']>;
  data_gte?: InputMaybe<Scalars['Bytes']>;
  data_in?: InputMaybe<Array<Scalars['Bytes']>>;
  data_lt?: InputMaybe<Scalars['Bytes']>;
  data_lte?: InputMaybe<Scalars['Bytes']>;
  data_not?: InputMaybe<Scalars['Bytes']>;
  data_not_contains?: InputMaybe<Scalars['Bytes']>;
  data_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from?: InputMaybe<Scalars['Bytes']>;
  from_contains?: InputMaybe<Scalars['Bytes']>;
  from_gt?: InputMaybe<Scalars['Bytes']>;
  from_gte?: InputMaybe<Scalars['Bytes']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_lt?: InputMaybe<Scalars['Bytes']>;
  from_lte?: InputMaybe<Scalars['Bytes']>;
  from_not?: InputMaybe<Scalars['Bytes']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator?: InputMaybe<Scalars['Bytes']>;
  operatorData?: InputMaybe<Scalars['Bytes']>;
  operatorData_contains?: InputMaybe<Scalars['Bytes']>;
  operatorData_gt?: InputMaybe<Scalars['Bytes']>;
  operatorData_gte?: InputMaybe<Scalars['Bytes']>;
  operatorData_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operatorData_lt?: InputMaybe<Scalars['Bytes']>;
  operatorData_lte?: InputMaybe<Scalars['Bytes']>;
  operatorData_not?: InputMaybe<Scalars['Bytes']>;
  operatorData_not_contains?: InputMaybe<Scalars['Bytes']>;
  operatorData_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator_contains?: InputMaybe<Scalars['Bytes']>;
  operator_gt?: InputMaybe<Scalars['Bytes']>;
  operator_gte?: InputMaybe<Scalars['Bytes']>;
  operator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator_lt?: InputMaybe<Scalars['Bytes']>;
  operator_lte?: InputMaybe<Scalars['Bytes']>;
  operator_not?: InputMaybe<Scalars['Bytes']>;
  operator_not_contains?: InputMaybe<Scalars['Bytes']>;
  operator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Burned_Filter>>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Burned_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Data = 'data',
  From = 'from',
  Id = 'id',
  Operator = 'operator',
  OperatorData = 'operatorData',
  TransactionHash = 'transactionHash'
}

export type ContractAdminChanged = {
  __typename?: 'ContractAdminChanged';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  newAdmin: Scalars['Bytes'];
  previousAdmin: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type ContractAdminChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ContractAdminChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  newAdmin?: InputMaybe<Scalars['Bytes']>;
  newAdmin_contains?: InputMaybe<Scalars['Bytes']>;
  newAdmin_gt?: InputMaybe<Scalars['Bytes']>;
  newAdmin_gte?: InputMaybe<Scalars['Bytes']>;
  newAdmin_in?: InputMaybe<Array<Scalars['Bytes']>>;
  newAdmin_lt?: InputMaybe<Scalars['Bytes']>;
  newAdmin_lte?: InputMaybe<Scalars['Bytes']>;
  newAdmin_not?: InputMaybe<Scalars['Bytes']>;
  newAdmin_not_contains?: InputMaybe<Scalars['Bytes']>;
  newAdmin_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<ContractAdminChanged_Filter>>>;
  previousAdmin?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_contains?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_gt?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_gte?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_in?: InputMaybe<Array<Scalars['Bytes']>>;
  previousAdmin_lt?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_lte?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_not?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_not_contains?: InputMaybe<Scalars['Bytes']>;
  previousAdmin_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum ContractAdminChanged_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  NewAdmin = 'newAdmin',
  PreviousAdmin = 'previousAdmin',
  TransactionHash = 'transactionHash'
}

export type ContractBeaconUpgraded = {
  __typename?: 'ContractBeaconUpgraded';
  beacon: Scalars['Bytes'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type ContractBeaconUpgraded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ContractBeaconUpgraded_Filter>>>;
  beacon?: InputMaybe<Scalars['Bytes']>;
  beacon_contains?: InputMaybe<Scalars['Bytes']>;
  beacon_gt?: InputMaybe<Scalars['Bytes']>;
  beacon_gte?: InputMaybe<Scalars['Bytes']>;
  beacon_in?: InputMaybe<Array<Scalars['Bytes']>>;
  beacon_lt?: InputMaybe<Scalars['Bytes']>;
  beacon_lte?: InputMaybe<Scalars['Bytes']>;
  beacon_not?: InputMaybe<Scalars['Bytes']>;
  beacon_not_contains?: InputMaybe<Scalars['Bytes']>;
  beacon_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<ContractBeaconUpgraded_Filter>>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum ContractBeaconUpgraded_OrderBy {
  Beacon = 'beacon',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  TransactionHash = 'transactionHash'
}

export type ContractUpgraded = {
  __typename?: 'ContractUpgraded';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  implementation: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type ContractUpgraded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ContractUpgraded_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  implementation?: InputMaybe<Scalars['Bytes']>;
  implementation_contains?: InputMaybe<Scalars['Bytes']>;
  implementation_gt?: InputMaybe<Scalars['Bytes']>;
  implementation_gte?: InputMaybe<Scalars['Bytes']>;
  implementation_in?: InputMaybe<Array<Scalars['Bytes']>>;
  implementation_lt?: InputMaybe<Scalars['Bytes']>;
  implementation_lte?: InputMaybe<Scalars['Bytes']>;
  implementation_not?: InputMaybe<Scalars['Bytes']>;
  implementation_not_contains?: InputMaybe<Scalars['Bytes']>;
  implementation_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<ContractUpgraded_Filter>>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum ContractUpgraded_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Implementation = 'implementation',
  TransactionHash = 'transactionHash'
}

export type Deposit = {
  __typename?: 'Deposit';
  assets: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  caller: Scalars['Bytes'];
  id: Scalars['Bytes'];
  owner: Scalars['Bytes'];
  shares: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type Deposit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Deposit_Filter>>>;
  assets?: InputMaybe<Scalars['BigInt']>;
  assets_gt?: InputMaybe<Scalars['BigInt']>;
  assets_gte?: InputMaybe<Scalars['BigInt']>;
  assets_in?: InputMaybe<Array<Scalars['BigInt']>>;
  assets_lt?: InputMaybe<Scalars['BigInt']>;
  assets_lte?: InputMaybe<Scalars['BigInt']>;
  assets_not?: InputMaybe<Scalars['BigInt']>;
  assets_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_gt?: InputMaybe<Scalars['Bytes']>;
  caller_gte?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_lt?: InputMaybe<Scalars['Bytes']>;
  caller_lte?: InputMaybe<Scalars['Bytes']>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Deposit_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  shares?: InputMaybe<Scalars['BigInt']>;
  shares_gt?: InputMaybe<Scalars['BigInt']>;
  shares_gte?: InputMaybe<Scalars['BigInt']>;
  shares_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shares_lt?: InputMaybe<Scalars['BigInt']>;
  shares_lte?: InputMaybe<Scalars['BigInt']>;
  shares_not?: InputMaybe<Scalars['BigInt']>;
  shares_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Deposit_OrderBy {
  Assets = 'assets',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Caller = 'caller',
  Id = 'id',
  Owner = 'owner',
  Shares = 'shares',
  TransactionHash = 'transactionHash'
}

export type Initialized = {
  __typename?: 'Initialized';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
  version: Scalars['Int'];
};

export type Initialized_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Initialized_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Initialized_Filter>>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  version?: InputMaybe<Scalars['Int']>;
  version_gt?: InputMaybe<Scalars['Int']>;
  version_gte?: InputMaybe<Scalars['Int']>;
  version_in?: InputMaybe<Array<Scalars['Int']>>;
  version_lt?: InputMaybe<Scalars['Int']>;
  version_lte?: InputMaybe<Scalars['Int']>;
  version_not?: InputMaybe<Scalars['Int']>;
  version_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum Initialized_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  TransactionHash = 'transactionHash',
  Version = 'version'
}

/**
 * Most markets only have a single interest rate given a specific type.
 * However, fixed term lending protocols can have multiple rates with
 * different duration/maturity per market. You can append a counter
 * to the IDs to differentiate.
 *
 */
export type InterestRate = {
  __typename?: 'InterestRate';
  /**  The interest rate recalculated to APY terms per different time periods  */
  apy: RewardApy;
  /**  Duration of the loan in days. Only applies to fixed term lending (e.g. Notional)  */
  duration?: Maybe<Scalars['Int']>;
  /**  { Market ID }-{ Interest rate side }-{ Interest rate type }  */
  id: Scalars['Bytes'];
  /**  Maturity of the loan in block height. Only applies to fixed term lending (e.g. Notional)  */
  maturityBlock?: Maybe<Scalars['BigInt']>;
  /**
   * Interest rate per block scaled by 10^18
   * @dev decimals hardcoded on lower levels
   *
   */
  perBlock: Scalars['BigInt'];
  /**  The party the interest is paid to / received from  */
  side: InterestRateSide;
  /**  The type of interest rate (e.g. stable, fixed, variable, etc)  */
  type: InterestRateType;
};

export enum InterestRateSide {
  /**  Interest rate paid by borrowers  */
  Borrower = 'BORROWER',
  /**  Interest rate accrued by lenders  */
  Lender = 'LENDER'
}

export enum InterestRateType {
  /**  Fixed interest rate (e.g. Notional)  */
  Fixed = 'FIXED',
  /**  Stable interest rate (e.g. Aave)  */
  Stable = 'STABLE',
  /**  Variable interest rate (e.g. Compound)  */
  Variable = 'VARIABLE'
}

export type InterestRate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<InterestRate_Filter>>>;
  apy?: InputMaybe<Scalars['String']>;
  apy_?: InputMaybe<RewardApy_Filter>;
  apy_contains?: InputMaybe<Scalars['String']>;
  apy_contains_nocase?: InputMaybe<Scalars['String']>;
  apy_ends_with?: InputMaybe<Scalars['String']>;
  apy_ends_with_nocase?: InputMaybe<Scalars['String']>;
  apy_gt?: InputMaybe<Scalars['String']>;
  apy_gte?: InputMaybe<Scalars['String']>;
  apy_in?: InputMaybe<Array<Scalars['String']>>;
  apy_lt?: InputMaybe<Scalars['String']>;
  apy_lte?: InputMaybe<Scalars['String']>;
  apy_not?: InputMaybe<Scalars['String']>;
  apy_not_contains?: InputMaybe<Scalars['String']>;
  apy_not_contains_nocase?: InputMaybe<Scalars['String']>;
  apy_not_ends_with?: InputMaybe<Scalars['String']>;
  apy_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  apy_not_in?: InputMaybe<Array<Scalars['String']>>;
  apy_not_starts_with?: InputMaybe<Scalars['String']>;
  apy_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  apy_starts_with?: InputMaybe<Scalars['String']>;
  apy_starts_with_nocase?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['Int']>;
  duration_gt?: InputMaybe<Scalars['Int']>;
  duration_gte?: InputMaybe<Scalars['Int']>;
  duration_in?: InputMaybe<Array<Scalars['Int']>>;
  duration_lt?: InputMaybe<Scalars['Int']>;
  duration_lte?: InputMaybe<Scalars['Int']>;
  duration_not?: InputMaybe<Scalars['Int']>;
  duration_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  maturityBlock?: InputMaybe<Scalars['BigInt']>;
  maturityBlock_gt?: InputMaybe<Scalars['BigInt']>;
  maturityBlock_gte?: InputMaybe<Scalars['BigInt']>;
  maturityBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maturityBlock_lt?: InputMaybe<Scalars['BigInt']>;
  maturityBlock_lte?: InputMaybe<Scalars['BigInt']>;
  maturityBlock_not?: InputMaybe<Scalars['BigInt']>;
  maturityBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<InterestRate_Filter>>>;
  perBlock?: InputMaybe<Scalars['BigInt']>;
  perBlock_gt?: InputMaybe<Scalars['BigInt']>;
  perBlock_gte?: InputMaybe<Scalars['BigInt']>;
  perBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  perBlock_lt?: InputMaybe<Scalars['BigInt']>;
  perBlock_lte?: InputMaybe<Scalars['BigInt']>;
  perBlock_not?: InputMaybe<Scalars['BigInt']>;
  perBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  side?: InputMaybe<InterestRateSide>;
  side_in?: InputMaybe<Array<InterestRateSide>>;
  side_not?: InputMaybe<InterestRateSide>;
  side_not_in?: InputMaybe<Array<InterestRateSide>>;
  type?: InputMaybe<InterestRateType>;
  type_in?: InputMaybe<Array<InterestRateType>>;
  type_not?: InputMaybe<InterestRateType>;
  type_not_in?: InputMaybe<Array<InterestRateType>>;
};

export enum InterestRate_OrderBy {
  Apy = 'apy',
  ApyDaily = 'apy__daily',
  ApyDecimals = 'apy__decimals',
  ApyId = 'apy__id',
  ApyMonthly = 'apy__monthly',
  ApyWeekly = 'apy__weekly',
  ApyYearly = 'apy__yearly',
  Duration = 'duration',
  Id = 'id',
  MaturityBlock = 'maturityBlock',
  PerBlock = 'perBlock',
  Side = 'side',
  Type = 'type'
}

export type LockedProfitReleaseRateChanged = {
  __typename?: 'LockedProfitReleaseRateChanged';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  rate: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type LockedProfitReleaseRateChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<LockedProfitReleaseRateChanged_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<LockedProfitReleaseRateChanged_Filter>>>;
  rate?: InputMaybe<Scalars['BigInt']>;
  rate_gt?: InputMaybe<Scalars['BigInt']>;
  rate_gte?: InputMaybe<Scalars['BigInt']>;
  rate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rate_lt?: InputMaybe<Scalars['BigInt']>;
  rate_lte?: InputMaybe<Scalars['BigInt']>;
  rate_not?: InputMaybe<Scalars['BigInt']>;
  rate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum LockedProfitReleaseRateChanged_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Rate = 'rate',
  TransactionHash = 'transactionHash'
}

export type Minted = {
  __typename?: 'Minted';
  amount: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  data: Scalars['Bytes'];
  id: Scalars['Bytes'];
  operator: Scalars['Bytes'];
  operatorData: Scalars['Bytes'];
  to: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type Minted_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  and?: InputMaybe<Array<InputMaybe<Minted_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  data?: InputMaybe<Scalars['Bytes']>;
  data_contains?: InputMaybe<Scalars['Bytes']>;
  data_gt?: InputMaybe<Scalars['Bytes']>;
  data_gte?: InputMaybe<Scalars['Bytes']>;
  data_in?: InputMaybe<Array<Scalars['Bytes']>>;
  data_lt?: InputMaybe<Scalars['Bytes']>;
  data_lte?: InputMaybe<Scalars['Bytes']>;
  data_not?: InputMaybe<Scalars['Bytes']>;
  data_not_contains?: InputMaybe<Scalars['Bytes']>;
  data_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator?: InputMaybe<Scalars['Bytes']>;
  operatorData?: InputMaybe<Scalars['Bytes']>;
  operatorData_contains?: InputMaybe<Scalars['Bytes']>;
  operatorData_gt?: InputMaybe<Scalars['Bytes']>;
  operatorData_gte?: InputMaybe<Scalars['Bytes']>;
  operatorData_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operatorData_lt?: InputMaybe<Scalars['Bytes']>;
  operatorData_lte?: InputMaybe<Scalars['Bytes']>;
  operatorData_not?: InputMaybe<Scalars['Bytes']>;
  operatorData_not_contains?: InputMaybe<Scalars['Bytes']>;
  operatorData_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator_contains?: InputMaybe<Scalars['Bytes']>;
  operator_gt?: InputMaybe<Scalars['Bytes']>;
  operator_gte?: InputMaybe<Scalars['Bytes']>;
  operator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator_lt?: InputMaybe<Scalars['Bytes']>;
  operator_lte?: InputMaybe<Scalars['Bytes']>;
  operator_not?: InputMaybe<Scalars['Bytes']>;
  operator_not_contains?: InputMaybe<Scalars['Bytes']>;
  operator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Minted_Filter>>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_gt?: InputMaybe<Scalars['Bytes']>;
  to_gte?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_lt?: InputMaybe<Scalars['Bytes']>;
  to_lte?: InputMaybe<Scalars['Bytes']>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Minted_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Data = 'data',
  Id = 'id',
  Operator = 'operator',
  OperatorData = 'operatorData',
  To = 'to',
  TransactionHash = 'transactionHash'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type OwnershipTransferred = {
  __typename?: 'OwnershipTransferred';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  newOwner: Scalars['Bytes'];
  previousOwner: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type OwnershipTransferred_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OwnershipTransferred_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  newOwner?: InputMaybe<Scalars['Bytes']>;
  newOwner_contains?: InputMaybe<Scalars['Bytes']>;
  newOwner_gt?: InputMaybe<Scalars['Bytes']>;
  newOwner_gte?: InputMaybe<Scalars['Bytes']>;
  newOwner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  newOwner_lt?: InputMaybe<Scalars['Bytes']>;
  newOwner_lte?: InputMaybe<Scalars['Bytes']>;
  newOwner_not?: InputMaybe<Scalars['Bytes']>;
  newOwner_not_contains?: InputMaybe<Scalars['Bytes']>;
  newOwner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<OwnershipTransferred_Filter>>>;
  previousOwner?: InputMaybe<Scalars['Bytes']>;
  previousOwner_contains?: InputMaybe<Scalars['Bytes']>;
  previousOwner_gt?: InputMaybe<Scalars['Bytes']>;
  previousOwner_gte?: InputMaybe<Scalars['Bytes']>;
  previousOwner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  previousOwner_lt?: InputMaybe<Scalars['Bytes']>;
  previousOwner_lte?: InputMaybe<Scalars['Bytes']>;
  previousOwner_not?: InputMaybe<Scalars['Bytes']>;
  previousOwner_not_contains?: InputMaybe<Scalars['Bytes']>;
  previousOwner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum OwnershipTransferred_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  NewOwner = 'newOwner',
  PreviousOwner = 'previousOwner',
  TransactionHash = 'transactionHash'
}

export type Paused = {
  __typename?: 'Paused';
  account: Scalars['Bytes'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type Paused_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['Bytes']>;
  account_contains?: InputMaybe<Scalars['Bytes']>;
  account_gt?: InputMaybe<Scalars['Bytes']>;
  account_gte?: InputMaybe<Scalars['Bytes']>;
  account_in?: InputMaybe<Array<Scalars['Bytes']>>;
  account_lt?: InputMaybe<Scalars['Bytes']>;
  account_lte?: InputMaybe<Scalars['Bytes']>;
  account_not?: InputMaybe<Scalars['Bytes']>;
  account_not_contains?: InputMaybe<Scalars['Bytes']>;
  account_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  and?: InputMaybe<Array<InputMaybe<Paused_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Paused_Filter>>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Paused_OrderBy {
  Account = 'account',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  TransactionHash = 'transactionHash'
}

export type Price = {
  __typename?: 'Price';
  /**
   * The decimals of the "value".
   *
   */
  decimals: Scalars['Int'];
  /**
   * The ID of the price (same as Token ID).
   *
   */
  id: Scalars['Bytes'];
  /**
   * The actual price of the token (scaled up to "decimals").
   *
   */
  value: Scalars['BigInt'];
};

export type Price_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Price_Filter>>>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Price_Filter>>>;
  value?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Price_OrderBy {
  Decimals = 'decimals',
  Id = 'id',
  Value = 'value'
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  adminChanged?: Maybe<AdminChanged>;
  adminChangeds: Array<AdminChanged>;
  approval?: Maybe<Approval>;
  approvals: Array<Approval>;
  authorizedOperator?: Maybe<AuthorizedOperator>;
  authorizedOperators: Array<AuthorizedOperator>;
  beaconUpgraded?: Maybe<BeaconUpgraded>;
  beaconUpgradeds: Array<BeaconUpgraded>;
  borrowerDebtManagementReported?: Maybe<BorrowerDebtManagementReported>;
  borrowerDebtManagementReporteds: Array<BorrowerDebtManagementReported>;
  burned?: Maybe<Burned>;
  burneds: Array<Burned>;
  contractAdminChanged?: Maybe<ContractAdminChanged>;
  contractAdminChangeds: Array<ContractAdminChanged>;
  contractBeaconUpgraded?: Maybe<ContractBeaconUpgraded>;
  contractBeaconUpgradeds: Array<ContractBeaconUpgraded>;
  contractUpgraded?: Maybe<ContractUpgraded>;
  contractUpgradeds: Array<ContractUpgraded>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  initialized?: Maybe<Initialized>;
  initializeds: Array<Initialized>;
  interestRate?: Maybe<InterestRate>;
  interestRates: Array<InterestRate>;
  lockedProfitReleaseRateChanged?: Maybe<LockedProfitReleaseRateChanged>;
  lockedProfitReleaseRateChangeds: Array<LockedProfitReleaseRateChanged>;
  minted?: Maybe<Minted>;
  minteds: Array<Minted>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
  paused?: Maybe<Paused>;
  pauseds: Array<Paused>;
  price?: Maybe<Price>;
  prices: Array<Price>;
  revokedOperator?: Maybe<RevokedOperator>;
  revokedOperators: Array<RevokedOperator>;
  rewardAPY?: Maybe<RewardApy>;
  rewardAPYs: Array<RewardApy>;
  sent?: Maybe<Sent>;
  sents: Array<Sent>;
  strategyAdded?: Maybe<StrategyAdded>;
  strategyAddeds: Array<StrategyAdded>;
  strategyRemoved?: Maybe<StrategyRemoved>;
  strategyRemoveds: Array<StrategyRemoved>;
  strategyReturnedToQueue?: Maybe<StrategyReturnedToQueue>;
  strategyReturnedToQueues: Array<StrategyReturnedToQueue>;
  strategyRevoked?: Maybe<StrategyRevoked>;
  strategyRevokeds: Array<StrategyRevoked>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  unpaused?: Maybe<Unpaused>;
  unpauseds: Array<Unpaused>;
  upgraded?: Maybe<Upgraded>;
  upgradeds: Array<Upgraded>;
  vault?: Maybe<Vault>;
  vaults: Array<Vault>;
  withdraw?: Maybe<Withdraw>;
  withdraws: Array<Withdraw>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAdminChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAdminChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AdminChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AdminChanged_Filter>;
};


export type QueryApprovalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryApprovalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Approval_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Approval_Filter>;
};


export type QueryAuthorizedOperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAuthorizedOperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AuthorizedOperator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuthorizedOperator_Filter>;
};


export type QueryBeaconUpgradedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBeaconUpgradedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BeaconUpgraded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BeaconUpgraded_Filter>;
};


export type QueryBorrowerDebtManagementReportedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBorrowerDebtManagementReportedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BorrowerDebtManagementReported_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BorrowerDebtManagementReported_Filter>;
};


export type QueryBurnedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBurnedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Burned_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Burned_Filter>;
};


export type QueryContractAdminChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryContractAdminChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ContractAdminChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ContractAdminChanged_Filter>;
};


export type QueryContractBeaconUpgradedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryContractBeaconUpgradedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ContractBeaconUpgraded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ContractBeaconUpgraded_Filter>;
};


export type QueryContractUpgradedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryContractUpgradedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ContractUpgraded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ContractUpgraded_Filter>;
};


export type QueryDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deposit_Filter>;
};


export type QueryInitializedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryInitializedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Initialized_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Initialized_Filter>;
};


export type QueryInterestRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryInterestRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<InterestRate_Filter>;
};


export type QueryLockedProfitReleaseRateChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLockedProfitReleaseRateChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LockedProfitReleaseRateChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LockedProfitReleaseRateChanged_Filter>;
};


export type QueryMintedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMintedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Minted_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Minted_Filter>;
};


export type QueryOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnershipTransferred_Filter>;
};


export type QueryPausedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPausedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Paused_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Paused_Filter>;
};


export type QueryPriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Price_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Price_Filter>;
};


export type QueryRevokedOperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRevokedOperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RevokedOperator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RevokedOperator_Filter>;
};


export type QueryRewardApyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRewardApYsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardApy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardApy_Filter>;
};


export type QuerySentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Sent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Sent_Filter>;
};


export type QueryStrategyAddedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStrategyAddedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StrategyAdded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StrategyAdded_Filter>;
};


export type QueryStrategyRemovedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStrategyRemovedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StrategyRemoved_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StrategyRemoved_Filter>;
};


export type QueryStrategyReturnedToQueueArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStrategyReturnedToQueuesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StrategyReturnedToQueue_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StrategyReturnedToQueue_Filter>;
};


export type QueryStrategyRevokedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStrategyRevokedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StrategyRevoked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StrategyRevoked_Filter>;
};


export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type QueryTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transfer_Filter>;
};


export type QueryUnpausedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUnpausedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Unpaused_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Unpaused_Filter>;
};


export type QueryUpgradedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUpgradedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Upgraded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Upgraded_Filter>;
};


export type QueryVaultArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVaultsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vault_Filter>;
};


export type QueryWithdrawArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWithdrawsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Withdraw_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Withdraw_Filter>;
};

export type RevokedOperator = {
  __typename?: 'RevokedOperator';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  operator: Scalars['Bytes'];
  tokenHolder: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type RevokedOperator_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RevokedOperator_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator?: InputMaybe<Scalars['Bytes']>;
  operator_contains?: InputMaybe<Scalars['Bytes']>;
  operator_gt?: InputMaybe<Scalars['Bytes']>;
  operator_gte?: InputMaybe<Scalars['Bytes']>;
  operator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator_lt?: InputMaybe<Scalars['Bytes']>;
  operator_lte?: InputMaybe<Scalars['Bytes']>;
  operator_not?: InputMaybe<Scalars['Bytes']>;
  operator_not_contains?: InputMaybe<Scalars['Bytes']>;
  operator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<RevokedOperator_Filter>>>;
  tokenHolder?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_contains?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_gt?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_gte?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tokenHolder_lt?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_lte?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_not?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_not_contains?: InputMaybe<Scalars['Bytes']>;
  tokenHolder_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum RevokedOperator_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Operator = 'operator',
  TokenHolder = 'tokenHolder',
  TransactionHash = 'transactionHash'
}

/**  The interest rate recalculated to APY terms per different time periods  */
export type RewardApy = {
  __typename?: 'RewardAPY';
  /**  Daily interest rate, represented as percentage scaled by 10^decimals  */
  daily: Scalars['BigInt'];
  /**  Decimals of the APY values, mainly  */
  decimals: Scalars['Int'];
  /**  { InterestRate.id }  */
  id: Scalars['Bytes'];
  /**  Monthly interest rate, represented as percentage scaled by 10^decimals  */
  monthly: Scalars['BigInt'];
  /**  Weekly interest rate, represented as percentage scaled by 10^decimals  */
  weekly: Scalars['BigInt'];
  /**  Yearly interest rate, represented as percentage scaled by 10^decimals  */
  yearly: Scalars['BigInt'];
};

export type RewardApy_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RewardApy_Filter>>>;
  daily?: InputMaybe<Scalars['BigInt']>;
  daily_gt?: InputMaybe<Scalars['BigInt']>;
  daily_gte?: InputMaybe<Scalars['BigInt']>;
  daily_in?: InputMaybe<Array<Scalars['BigInt']>>;
  daily_lt?: InputMaybe<Scalars['BigInt']>;
  daily_lte?: InputMaybe<Scalars['BigInt']>;
  daily_not?: InputMaybe<Scalars['BigInt']>;
  daily_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  monthly?: InputMaybe<Scalars['BigInt']>;
  monthly_gt?: InputMaybe<Scalars['BigInt']>;
  monthly_gte?: InputMaybe<Scalars['BigInt']>;
  monthly_in?: InputMaybe<Array<Scalars['BigInt']>>;
  monthly_lt?: InputMaybe<Scalars['BigInt']>;
  monthly_lte?: InputMaybe<Scalars['BigInt']>;
  monthly_not?: InputMaybe<Scalars['BigInt']>;
  monthly_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  or?: InputMaybe<Array<InputMaybe<RewardApy_Filter>>>;
  weekly?: InputMaybe<Scalars['BigInt']>;
  weekly_gt?: InputMaybe<Scalars['BigInt']>;
  weekly_gte?: InputMaybe<Scalars['BigInt']>;
  weekly_in?: InputMaybe<Array<Scalars['BigInt']>>;
  weekly_lt?: InputMaybe<Scalars['BigInt']>;
  weekly_lte?: InputMaybe<Scalars['BigInt']>;
  weekly_not?: InputMaybe<Scalars['BigInt']>;
  weekly_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  yearly?: InputMaybe<Scalars['BigInt']>;
  yearly_gt?: InputMaybe<Scalars['BigInt']>;
  yearly_gte?: InputMaybe<Scalars['BigInt']>;
  yearly_in?: InputMaybe<Array<Scalars['BigInt']>>;
  yearly_lt?: InputMaybe<Scalars['BigInt']>;
  yearly_lte?: InputMaybe<Scalars['BigInt']>;
  yearly_not?: InputMaybe<Scalars['BigInt']>;
  yearly_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum RewardApy_OrderBy {
  Daily = 'daily',
  Decimals = 'decimals',
  Id = 'id',
  Monthly = 'monthly',
  Weekly = 'weekly',
  Yearly = 'yearly'
}

export type Sent = {
  __typename?: 'Sent';
  amount: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  data: Scalars['Bytes'];
  from: Scalars['Bytes'];
  id: Scalars['Bytes'];
  operator: Scalars['Bytes'];
  operatorData: Scalars['Bytes'];
  to: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type Sent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  and?: InputMaybe<Array<InputMaybe<Sent_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  data?: InputMaybe<Scalars['Bytes']>;
  data_contains?: InputMaybe<Scalars['Bytes']>;
  data_gt?: InputMaybe<Scalars['Bytes']>;
  data_gte?: InputMaybe<Scalars['Bytes']>;
  data_in?: InputMaybe<Array<Scalars['Bytes']>>;
  data_lt?: InputMaybe<Scalars['Bytes']>;
  data_lte?: InputMaybe<Scalars['Bytes']>;
  data_not?: InputMaybe<Scalars['Bytes']>;
  data_not_contains?: InputMaybe<Scalars['Bytes']>;
  data_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from?: InputMaybe<Scalars['Bytes']>;
  from_contains?: InputMaybe<Scalars['Bytes']>;
  from_gt?: InputMaybe<Scalars['Bytes']>;
  from_gte?: InputMaybe<Scalars['Bytes']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_lt?: InputMaybe<Scalars['Bytes']>;
  from_lte?: InputMaybe<Scalars['Bytes']>;
  from_not?: InputMaybe<Scalars['Bytes']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator?: InputMaybe<Scalars['Bytes']>;
  operatorData?: InputMaybe<Scalars['Bytes']>;
  operatorData_contains?: InputMaybe<Scalars['Bytes']>;
  operatorData_gt?: InputMaybe<Scalars['Bytes']>;
  operatorData_gte?: InputMaybe<Scalars['Bytes']>;
  operatorData_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operatorData_lt?: InputMaybe<Scalars['Bytes']>;
  operatorData_lte?: InputMaybe<Scalars['Bytes']>;
  operatorData_not?: InputMaybe<Scalars['Bytes']>;
  operatorData_not_contains?: InputMaybe<Scalars['Bytes']>;
  operatorData_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator_contains?: InputMaybe<Scalars['Bytes']>;
  operator_gt?: InputMaybe<Scalars['Bytes']>;
  operator_gte?: InputMaybe<Scalars['Bytes']>;
  operator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator_lt?: InputMaybe<Scalars['Bytes']>;
  operator_lte?: InputMaybe<Scalars['Bytes']>;
  operator_not?: InputMaybe<Scalars['Bytes']>;
  operator_not_contains?: InputMaybe<Scalars['Bytes']>;
  operator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Sent_Filter>>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_gt?: InputMaybe<Scalars['Bytes']>;
  to_gte?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_lt?: InputMaybe<Scalars['Bytes']>;
  to_lte?: InputMaybe<Scalars['Bytes']>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Sent_OrderBy {
  Amount = 'amount',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Data = 'data',
  From = 'from',
  Id = 'id',
  Operator = 'operator',
  OperatorData = 'operatorData',
  To = 'to',
  TransactionHash = 'transactionHash'
}

export type StrategyAdded = {
  __typename?: 'StrategyAdded';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  debtRatio: Scalars['BigInt'];
  id: Scalars['Bytes'];
  strategy: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type StrategyAdded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StrategyAdded_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  debtRatio?: InputMaybe<Scalars['BigInt']>;
  debtRatio_gt?: InputMaybe<Scalars['BigInt']>;
  debtRatio_gte?: InputMaybe<Scalars['BigInt']>;
  debtRatio_in?: InputMaybe<Array<Scalars['BigInt']>>;
  debtRatio_lt?: InputMaybe<Scalars['BigInt']>;
  debtRatio_lte?: InputMaybe<Scalars['BigInt']>;
  debtRatio_not?: InputMaybe<Scalars['BigInt']>;
  debtRatio_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<StrategyAdded_Filter>>>;
  strategy?: InputMaybe<Scalars['Bytes']>;
  strategy_contains?: InputMaybe<Scalars['Bytes']>;
  strategy_gt?: InputMaybe<Scalars['Bytes']>;
  strategy_gte?: InputMaybe<Scalars['Bytes']>;
  strategy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  strategy_lt?: InputMaybe<Scalars['Bytes']>;
  strategy_lte?: InputMaybe<Scalars['Bytes']>;
  strategy_not?: InputMaybe<Scalars['Bytes']>;
  strategy_not_contains?: InputMaybe<Scalars['Bytes']>;
  strategy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum StrategyAdded_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  DebtRatio = 'debtRatio',
  Id = 'id',
  Strategy = 'strategy',
  TransactionHash = 'transactionHash'
}

export type StrategyRemoved = {
  __typename?: 'StrategyRemoved';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  fromQueueOnly: Scalars['Boolean'];
  id: Scalars['Bytes'];
  strategy: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type StrategyRemoved_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StrategyRemoved_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fromQueueOnly?: InputMaybe<Scalars['Boolean']>;
  fromQueueOnly_in?: InputMaybe<Array<Scalars['Boolean']>>;
  fromQueueOnly_not?: InputMaybe<Scalars['Boolean']>;
  fromQueueOnly_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<StrategyRemoved_Filter>>>;
  strategy?: InputMaybe<Scalars['Bytes']>;
  strategy_contains?: InputMaybe<Scalars['Bytes']>;
  strategy_gt?: InputMaybe<Scalars['Bytes']>;
  strategy_gte?: InputMaybe<Scalars['Bytes']>;
  strategy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  strategy_lt?: InputMaybe<Scalars['Bytes']>;
  strategy_lte?: InputMaybe<Scalars['Bytes']>;
  strategy_not?: InputMaybe<Scalars['Bytes']>;
  strategy_not_contains?: InputMaybe<Scalars['Bytes']>;
  strategy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum StrategyRemoved_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  FromQueueOnly = 'fromQueueOnly',
  Id = 'id',
  Strategy = 'strategy',
  TransactionHash = 'transactionHash'
}

export type StrategyReturnedToQueue = {
  __typename?: 'StrategyReturnedToQueue';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  strategy: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type StrategyReturnedToQueue_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StrategyReturnedToQueue_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<StrategyReturnedToQueue_Filter>>>;
  strategy?: InputMaybe<Scalars['Bytes']>;
  strategy_contains?: InputMaybe<Scalars['Bytes']>;
  strategy_gt?: InputMaybe<Scalars['Bytes']>;
  strategy_gte?: InputMaybe<Scalars['Bytes']>;
  strategy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  strategy_lt?: InputMaybe<Scalars['Bytes']>;
  strategy_lte?: InputMaybe<Scalars['Bytes']>;
  strategy_not?: InputMaybe<Scalars['Bytes']>;
  strategy_not_contains?: InputMaybe<Scalars['Bytes']>;
  strategy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum StrategyReturnedToQueue_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Strategy = 'strategy',
  TransactionHash = 'transactionHash'
}

export type StrategyRevoked = {
  __typename?: 'StrategyRevoked';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  strategy: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type StrategyRevoked_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<StrategyRevoked_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<StrategyRevoked_Filter>>>;
  strategy?: InputMaybe<Scalars['Bytes']>;
  strategy_contains?: InputMaybe<Scalars['Bytes']>;
  strategy_gt?: InputMaybe<Scalars['Bytes']>;
  strategy_gte?: InputMaybe<Scalars['Bytes']>;
  strategy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  strategy_lt?: InputMaybe<Scalars['Bytes']>;
  strategy_lte?: InputMaybe<Scalars['Bytes']>;
  strategy_not?: InputMaybe<Scalars['Bytes']>;
  strategy_not_contains?: InputMaybe<Scalars['Bytes']>;
  strategy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum StrategyRevoked_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Strategy = 'strategy',
  TransactionHash = 'transactionHash'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  adminChanged?: Maybe<AdminChanged>;
  adminChangeds: Array<AdminChanged>;
  approval?: Maybe<Approval>;
  approvals: Array<Approval>;
  authorizedOperator?: Maybe<AuthorizedOperator>;
  authorizedOperators: Array<AuthorizedOperator>;
  beaconUpgraded?: Maybe<BeaconUpgraded>;
  beaconUpgradeds: Array<BeaconUpgraded>;
  borrowerDebtManagementReported?: Maybe<BorrowerDebtManagementReported>;
  borrowerDebtManagementReporteds: Array<BorrowerDebtManagementReported>;
  burned?: Maybe<Burned>;
  burneds: Array<Burned>;
  contractAdminChanged?: Maybe<ContractAdminChanged>;
  contractAdminChangeds: Array<ContractAdminChanged>;
  contractBeaconUpgraded?: Maybe<ContractBeaconUpgraded>;
  contractBeaconUpgradeds: Array<ContractBeaconUpgraded>;
  contractUpgraded?: Maybe<ContractUpgraded>;
  contractUpgradeds: Array<ContractUpgraded>;
  deposit?: Maybe<Deposit>;
  deposits: Array<Deposit>;
  initialized?: Maybe<Initialized>;
  initializeds: Array<Initialized>;
  interestRate?: Maybe<InterestRate>;
  interestRates: Array<InterestRate>;
  lockedProfitReleaseRateChanged?: Maybe<LockedProfitReleaseRateChanged>;
  lockedProfitReleaseRateChangeds: Array<LockedProfitReleaseRateChanged>;
  minted?: Maybe<Minted>;
  minteds: Array<Minted>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
  paused?: Maybe<Paused>;
  pauseds: Array<Paused>;
  price?: Maybe<Price>;
  prices: Array<Price>;
  revokedOperator?: Maybe<RevokedOperator>;
  revokedOperators: Array<RevokedOperator>;
  rewardAPY?: Maybe<RewardApy>;
  rewardAPYs: Array<RewardApy>;
  sent?: Maybe<Sent>;
  sents: Array<Sent>;
  strategyAdded?: Maybe<StrategyAdded>;
  strategyAddeds: Array<StrategyAdded>;
  strategyRemoved?: Maybe<StrategyRemoved>;
  strategyRemoveds: Array<StrategyRemoved>;
  strategyReturnedToQueue?: Maybe<StrategyReturnedToQueue>;
  strategyReturnedToQueues: Array<StrategyReturnedToQueue>;
  strategyRevoked?: Maybe<StrategyRevoked>;
  strategyRevokeds: Array<StrategyRevoked>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  unpaused?: Maybe<Unpaused>;
  unpauseds: Array<Unpaused>;
  upgraded?: Maybe<Upgraded>;
  upgradeds: Array<Upgraded>;
  vault?: Maybe<Vault>;
  vaults: Array<Vault>;
  withdraw?: Maybe<Withdraw>;
  withdraws: Array<Withdraw>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAdminChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAdminChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AdminChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AdminChanged_Filter>;
};


export type SubscriptionApprovalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionApprovalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Approval_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Approval_Filter>;
};


export type SubscriptionAuthorizedOperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAuthorizedOperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AuthorizedOperator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AuthorizedOperator_Filter>;
};


export type SubscriptionBeaconUpgradedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBeaconUpgradedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BeaconUpgraded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BeaconUpgraded_Filter>;
};


export type SubscriptionBorrowerDebtManagementReportedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBorrowerDebtManagementReportedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BorrowerDebtManagementReported_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BorrowerDebtManagementReported_Filter>;
};


export type SubscriptionBurnedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBurnedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Burned_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Burned_Filter>;
};


export type SubscriptionContractAdminChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionContractAdminChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ContractAdminChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ContractAdminChanged_Filter>;
};


export type SubscriptionContractBeaconUpgradedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionContractBeaconUpgradedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ContractBeaconUpgraded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ContractBeaconUpgraded_Filter>;
};


export type SubscriptionContractUpgradedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionContractUpgradedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ContractUpgraded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ContractUpgraded_Filter>;
};


export type SubscriptionDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deposit_Filter>;
};


export type SubscriptionInitializedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionInitializedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Initialized_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Initialized_Filter>;
};


export type SubscriptionInterestRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionInterestRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<InterestRate_Filter>;
};


export type SubscriptionLockedProfitReleaseRateChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionLockedProfitReleaseRateChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LockedProfitReleaseRateChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LockedProfitReleaseRateChanged_Filter>;
};


export type SubscriptionMintedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMintedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Minted_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Minted_Filter>;
};


export type SubscriptionOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnershipTransferred_Filter>;
};


export type SubscriptionPausedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPausedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Paused_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Paused_Filter>;
};


export type SubscriptionPriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Price_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Price_Filter>;
};


export type SubscriptionRevokedOperatorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRevokedOperatorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RevokedOperator_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RevokedOperator_Filter>;
};


export type SubscriptionRewardApyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRewardApYsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardApy_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardApy_Filter>;
};


export type SubscriptionSentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Sent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Sent_Filter>;
};


export type SubscriptionStrategyAddedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStrategyAddedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StrategyAdded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StrategyAdded_Filter>;
};


export type SubscriptionStrategyRemovedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStrategyRemovedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StrategyRemoved_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StrategyRemoved_Filter>;
};


export type SubscriptionStrategyReturnedToQueueArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStrategyReturnedToQueuesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StrategyReturnedToQueue_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StrategyReturnedToQueue_Filter>;
};


export type SubscriptionStrategyRevokedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStrategyRevokedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StrategyRevoked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StrategyRevoked_Filter>;
};


export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type SubscriptionTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transfer_Filter>;
};


export type SubscriptionUnpausedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUnpausedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Unpaused_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Unpaused_Filter>;
};


export type SubscriptionUpgradedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUpgradedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Upgraded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Upgraded_Filter>;
};


export type SubscriptionVaultArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVaultsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Vault_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Vault_Filter>;
};


export type SubscriptionWithdrawArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWithdrawsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Withdraw_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Withdraw_Filter>;
};

/**
 * Token of standart ERC20, can be stored in vault.
 *
 */
export type Token = {
  __typename?: 'Token';
  /**
   * The blockchain address of the asset.
   *
   */
  address: Scalars['String'];
  /**
   * The number of decimal places for the asset.
   *
   */
  decimals: Scalars['Int'];
  /**
   * The ID of the token. Mainly used for subgraph internal indexing.
   *
   */
  id: Scalars['Bytes'];
  /**
   * The name of the asset.
   *
   */
  name: Scalars['String'];
  /**
   * The price of the token.
   *
   */
  price: Price;
  /**
   * The symbol of the asset.
   *
   */
  symbol: Scalars['String'];
};

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['String']>;
  address_contains?: InputMaybe<Scalars['String']>;
  address_contains_nocase?: InputMaybe<Scalars['String']>;
  address_ends_with?: InputMaybe<Scalars['String']>;
  address_ends_with_nocase?: InputMaybe<Scalars['String']>;
  address_gt?: InputMaybe<Scalars['String']>;
  address_gte?: InputMaybe<Scalars['String']>;
  address_in?: InputMaybe<Array<Scalars['String']>>;
  address_lt?: InputMaybe<Scalars['String']>;
  address_lte?: InputMaybe<Scalars['String']>;
  address_not?: InputMaybe<Scalars['String']>;
  address_not_contains?: InputMaybe<Scalars['String']>;
  address_not_contains_nocase?: InputMaybe<Scalars['String']>;
  address_not_ends_with?: InputMaybe<Scalars['String']>;
  address_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  address_not_in?: InputMaybe<Array<Scalars['String']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']>;
  address_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  address_starts_with?: InputMaybe<Scalars['String']>;
  address_starts_with_nocase?: InputMaybe<Scalars['String']>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  price?: InputMaybe<Scalars['String']>;
  price_?: InputMaybe<Price_Filter>;
  price_contains?: InputMaybe<Scalars['String']>;
  price_contains_nocase?: InputMaybe<Scalars['String']>;
  price_ends_with?: InputMaybe<Scalars['String']>;
  price_ends_with_nocase?: InputMaybe<Scalars['String']>;
  price_gt?: InputMaybe<Scalars['String']>;
  price_gte?: InputMaybe<Scalars['String']>;
  price_in?: InputMaybe<Array<Scalars['String']>>;
  price_lt?: InputMaybe<Scalars['String']>;
  price_lte?: InputMaybe<Scalars['String']>;
  price_not?: InputMaybe<Scalars['String']>;
  price_not_contains?: InputMaybe<Scalars['String']>;
  price_not_contains_nocase?: InputMaybe<Scalars['String']>;
  price_not_ends_with?: InputMaybe<Scalars['String']>;
  price_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  price_not_in?: InputMaybe<Array<Scalars['String']>>;
  price_not_starts_with?: InputMaybe<Scalars['String']>;
  price_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  price_starts_with?: InputMaybe<Scalars['String']>;
  price_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Token_OrderBy {
  Address = 'address',
  Decimals = 'decimals',
  Id = 'id',
  Name = 'name',
  Price = 'price',
  PriceDecimals = 'price__decimals',
  PriceId = 'price__id',
  PriceValue = 'price__value',
  Symbol = 'symbol'
}

export type Transfer = {
  __typename?: 'Transfer';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  from: Scalars['Bytes'];
  id: Scalars['Bytes'];
  to: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
  value: Scalars['BigInt'];
};

export type Transfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Transfer_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  from?: InputMaybe<Scalars['Bytes']>;
  from_contains?: InputMaybe<Scalars['Bytes']>;
  from_gt?: InputMaybe<Scalars['Bytes']>;
  from_gte?: InputMaybe<Scalars['Bytes']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_lt?: InputMaybe<Scalars['Bytes']>;
  from_lte?: InputMaybe<Scalars['Bytes']>;
  from_not?: InputMaybe<Scalars['Bytes']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Transfer_Filter>>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_gt?: InputMaybe<Scalars['Bytes']>;
  to_gte?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_lt?: InputMaybe<Scalars['Bytes']>;
  to_lte?: InputMaybe<Scalars['Bytes']>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  value?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Transfer_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  From = 'from',
  Id = 'id',
  To = 'to',
  TransactionHash = 'transactionHash',
  Value = 'value'
}

export type Unpaused = {
  __typename?: 'Unpaused';
  account: Scalars['Bytes'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
};

export type Unpaused_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  account?: InputMaybe<Scalars['Bytes']>;
  account_contains?: InputMaybe<Scalars['Bytes']>;
  account_gt?: InputMaybe<Scalars['Bytes']>;
  account_gte?: InputMaybe<Scalars['Bytes']>;
  account_in?: InputMaybe<Array<Scalars['Bytes']>>;
  account_lt?: InputMaybe<Scalars['Bytes']>;
  account_lte?: InputMaybe<Scalars['Bytes']>;
  account_not?: InputMaybe<Scalars['Bytes']>;
  account_not_contains?: InputMaybe<Scalars['Bytes']>;
  account_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  and?: InputMaybe<Array<InputMaybe<Unpaused_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Unpaused_Filter>>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Unpaused_OrderBy {
  Account = 'account',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  TransactionHash = 'transactionHash'
}

export type Upgraded = {
  __typename?: 'Upgraded';
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['Bytes'];
  implementation: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
  version: Scalars['String'];
};

export type Upgraded_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Upgraded_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  implementation?: InputMaybe<Scalars['Bytes']>;
  implementation_contains?: InputMaybe<Scalars['Bytes']>;
  implementation_gt?: InputMaybe<Scalars['Bytes']>;
  implementation_gte?: InputMaybe<Scalars['Bytes']>;
  implementation_in?: InputMaybe<Array<Scalars['Bytes']>>;
  implementation_lt?: InputMaybe<Scalars['Bytes']>;
  implementation_lte?: InputMaybe<Scalars['Bytes']>;
  implementation_not?: InputMaybe<Scalars['Bytes']>;
  implementation_not_contains?: InputMaybe<Scalars['Bytes']>;
  implementation_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Upgraded_Filter>>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  version?: InputMaybe<Scalars['String']>;
  version_contains?: InputMaybe<Scalars['String']>;
  version_contains_nocase?: InputMaybe<Scalars['String']>;
  version_ends_with?: InputMaybe<Scalars['String']>;
  version_ends_with_nocase?: InputMaybe<Scalars['String']>;
  version_gt?: InputMaybe<Scalars['String']>;
  version_gte?: InputMaybe<Scalars['String']>;
  version_in?: InputMaybe<Array<Scalars['String']>>;
  version_lt?: InputMaybe<Scalars['String']>;
  version_lte?: InputMaybe<Scalars['String']>;
  version_not?: InputMaybe<Scalars['String']>;
  version_not_contains?: InputMaybe<Scalars['String']>;
  version_not_contains_nocase?: InputMaybe<Scalars['String']>;
  version_not_ends_with?: InputMaybe<Scalars['String']>;
  version_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  version_not_in?: InputMaybe<Array<Scalars['String']>>;
  version_not_starts_with?: InputMaybe<Scalars['String']>;
  version_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  version_starts_with?: InputMaybe<Scalars['String']>;
  version_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Upgraded_OrderBy {
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Implementation = 'implementation',
  TransactionHash = 'transactionHash',
  Version = 'version'
}

export type Vault = {
  __typename?: 'Vault';
  /**
   * The blockchain address of the vault.
   *
   */
  address: Scalars['String'];
  /**
   * The underlying asset stored in the vault.
   *
   */
  asset: Token;
  /**
   * Debt ratio for the Lender across all borrowers.
   * @dev Requires decimals adjustment by "maxBps" field.
   *
   */
  debtRatio: Scalars['BigInt'];
  /**
   * The number of decimal places for the vault's assets.
   *
   */
  decimals: Scalars['Int'];
  /**
   * Total amount of tokens that the Vault has (including locked profit).
   * @dev Requires decimals adjustment by token "decimals" field.
   *
   */
  fundAssets: Scalars['BigInt'];
  /**
   * Price in USD of all tokens that the Vault has (including locked profit).
   * @dev Requires decimals adjustment by price "decimals" field.
   *
   */
  fundAssetsUSD: Scalars['BigInt'];
  /**
   * The ID of the vault. Mainly used for subgraph internal indexing.
   *
   */
  id: Scalars['Bytes'];
  /**
   * Last time a report occurred by any borrower.
   *
   */
  lastReportTimestamp: Scalars['BigInt'];
  /**
   * BPS points used to make adjustments for percentage-like fields for Vault and Lender.
   * @dev is actually stored Int, but the lender uses uint256 so as not to cause an overflow, use BigInt.
   *
   */
  maxBps: Scalars['BigInt'];
  /**
   * The name of the vault.
   *
   */
  name: Scalars['String'];
  /**
   * All interest rates / fees allowed in the market. Interest rate should be in APY percentage.
   *
   */
  rates: Array<InterestRate>;
  /**
   * The symbol of the vault.
   *
   */
  symbol: Scalars['String'];
  /**
   * Amount of tokens that the Vault has (minus the locked profit).
   * @dev Requires decimals adjustment by token "decimals" field.
   *
   */
  totalAssets: Scalars['BigInt'];
  /**
   * Amount of tokens that all borrowers have taken.
   * @dev Requires decimals adjustment by token "decimals" field.
   *
   */
  totalDebt: Scalars['BigInt'];
  /**
   * The total amount of shares in vault.
   * @dev Requires decimals adjustment by token "decimals" field.
   *
   */
  totalSupply: Scalars['BigInt'];
  /**
   * Total utilisation rate for the Vault across all strategies.
   * @dev Requires decimals adjustment by "maxBps" field.
   *
   */
  totalUtilisationRate: Scalars['BigInt'];
  /**
   * Current version of protocol in semver notation.
   *
   */
  version: Scalars['String'];
};


export type VaultRatesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<InterestRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<InterestRate_Filter>;
};

export type Vault_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['String']>;
  address_contains?: InputMaybe<Scalars['String']>;
  address_contains_nocase?: InputMaybe<Scalars['String']>;
  address_ends_with?: InputMaybe<Scalars['String']>;
  address_ends_with_nocase?: InputMaybe<Scalars['String']>;
  address_gt?: InputMaybe<Scalars['String']>;
  address_gte?: InputMaybe<Scalars['String']>;
  address_in?: InputMaybe<Array<Scalars['String']>>;
  address_lt?: InputMaybe<Scalars['String']>;
  address_lte?: InputMaybe<Scalars['String']>;
  address_not?: InputMaybe<Scalars['String']>;
  address_not_contains?: InputMaybe<Scalars['String']>;
  address_not_contains_nocase?: InputMaybe<Scalars['String']>;
  address_not_ends_with?: InputMaybe<Scalars['String']>;
  address_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  address_not_in?: InputMaybe<Array<Scalars['String']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']>;
  address_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  address_starts_with?: InputMaybe<Scalars['String']>;
  address_starts_with_nocase?: InputMaybe<Scalars['String']>;
  and?: InputMaybe<Array<InputMaybe<Vault_Filter>>>;
  asset?: InputMaybe<Scalars['String']>;
  asset_?: InputMaybe<Token_Filter>;
  asset_contains?: InputMaybe<Scalars['String']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_ends_with?: InputMaybe<Scalars['String']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_gt?: InputMaybe<Scalars['String']>;
  asset_gte?: InputMaybe<Scalars['String']>;
  asset_in?: InputMaybe<Array<Scalars['String']>>;
  asset_lt?: InputMaybe<Scalars['String']>;
  asset_lte?: InputMaybe<Scalars['String']>;
  asset_not?: InputMaybe<Scalars['String']>;
  asset_not_contains?: InputMaybe<Scalars['String']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset_starts_with?: InputMaybe<Scalars['String']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']>;
  debtRatio?: InputMaybe<Scalars['BigInt']>;
  debtRatio_gt?: InputMaybe<Scalars['BigInt']>;
  debtRatio_gte?: InputMaybe<Scalars['BigInt']>;
  debtRatio_in?: InputMaybe<Array<Scalars['BigInt']>>;
  debtRatio_lt?: InputMaybe<Scalars['BigInt']>;
  debtRatio_lte?: InputMaybe<Scalars['BigInt']>;
  debtRatio_not?: InputMaybe<Scalars['BigInt']>;
  debtRatio_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  fundAssets?: InputMaybe<Scalars['BigInt']>;
  fundAssetsUSD?: InputMaybe<Scalars['BigInt']>;
  fundAssetsUSD_gt?: InputMaybe<Scalars['BigInt']>;
  fundAssetsUSD_gte?: InputMaybe<Scalars['BigInt']>;
  fundAssetsUSD_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundAssetsUSD_lt?: InputMaybe<Scalars['BigInt']>;
  fundAssetsUSD_lte?: InputMaybe<Scalars['BigInt']>;
  fundAssetsUSD_not?: InputMaybe<Scalars['BigInt']>;
  fundAssetsUSD_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundAssets_gt?: InputMaybe<Scalars['BigInt']>;
  fundAssets_gte?: InputMaybe<Scalars['BigInt']>;
  fundAssets_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundAssets_lt?: InputMaybe<Scalars['BigInt']>;
  fundAssets_lte?: InputMaybe<Scalars['BigInt']>;
  fundAssets_not?: InputMaybe<Scalars['BigInt']>;
  fundAssets_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lastReportTimestamp?: InputMaybe<Scalars['BigInt']>;
  lastReportTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  lastReportTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  lastReportTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastReportTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  lastReportTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  lastReportTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  lastReportTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxBps?: InputMaybe<Scalars['BigInt']>;
  maxBps_gt?: InputMaybe<Scalars['BigInt']>;
  maxBps_gte?: InputMaybe<Scalars['BigInt']>;
  maxBps_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxBps_lt?: InputMaybe<Scalars['BigInt']>;
  maxBps_lte?: InputMaybe<Scalars['BigInt']>;
  maxBps_not?: InputMaybe<Scalars['BigInt']>;
  maxBps_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<InputMaybe<Vault_Filter>>>;
  rates?: InputMaybe<Array<Scalars['String']>>;
  rates_?: InputMaybe<InterestRate_Filter>;
  rates_contains?: InputMaybe<Array<Scalars['String']>>;
  rates_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  rates_not?: InputMaybe<Array<Scalars['String']>>;
  rates_not_contains?: InputMaybe<Array<Scalars['String']>>;
  rates_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalAssets?: InputMaybe<Scalars['BigInt']>;
  totalAssets_gt?: InputMaybe<Scalars['BigInt']>;
  totalAssets_gte?: InputMaybe<Scalars['BigInt']>;
  totalAssets_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAssets_lt?: InputMaybe<Scalars['BigInt']>;
  totalAssets_lte?: InputMaybe<Scalars['BigInt']>;
  totalAssets_not?: InputMaybe<Scalars['BigInt']>;
  totalAssets_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalDebt?: InputMaybe<Scalars['BigInt']>;
  totalDebt_gt?: InputMaybe<Scalars['BigInt']>;
  totalDebt_gte?: InputMaybe<Scalars['BigInt']>;
  totalDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalDebt_lt?: InputMaybe<Scalars['BigInt']>;
  totalDebt_lte?: InputMaybe<Scalars['BigInt']>;
  totalDebt_not?: InputMaybe<Scalars['BigInt']>;
  totalDebt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalUtilisationRate?: InputMaybe<Scalars['BigInt']>;
  totalUtilisationRate_gt?: InputMaybe<Scalars['BigInt']>;
  totalUtilisationRate_gte?: InputMaybe<Scalars['BigInt']>;
  totalUtilisationRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalUtilisationRate_lt?: InputMaybe<Scalars['BigInt']>;
  totalUtilisationRate_lte?: InputMaybe<Scalars['BigInt']>;
  totalUtilisationRate_not?: InputMaybe<Scalars['BigInt']>;
  totalUtilisationRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  version?: InputMaybe<Scalars['String']>;
  version_contains?: InputMaybe<Scalars['String']>;
  version_contains_nocase?: InputMaybe<Scalars['String']>;
  version_ends_with?: InputMaybe<Scalars['String']>;
  version_ends_with_nocase?: InputMaybe<Scalars['String']>;
  version_gt?: InputMaybe<Scalars['String']>;
  version_gte?: InputMaybe<Scalars['String']>;
  version_in?: InputMaybe<Array<Scalars['String']>>;
  version_lt?: InputMaybe<Scalars['String']>;
  version_lte?: InputMaybe<Scalars['String']>;
  version_not?: InputMaybe<Scalars['String']>;
  version_not_contains?: InputMaybe<Scalars['String']>;
  version_not_contains_nocase?: InputMaybe<Scalars['String']>;
  version_not_ends_with?: InputMaybe<Scalars['String']>;
  version_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  version_not_in?: InputMaybe<Array<Scalars['String']>>;
  version_not_starts_with?: InputMaybe<Scalars['String']>;
  version_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  version_starts_with?: InputMaybe<Scalars['String']>;
  version_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Vault_OrderBy {
  Address = 'address',
  Asset = 'asset',
  AssetAddress = 'asset__address',
  AssetDecimals = 'asset__decimals',
  AssetId = 'asset__id',
  AssetName = 'asset__name',
  AssetSymbol = 'asset__symbol',
  DebtRatio = 'debtRatio',
  Decimals = 'decimals',
  FundAssets = 'fundAssets',
  FundAssetsUsd = 'fundAssetsUSD',
  Id = 'id',
  LastReportTimestamp = 'lastReportTimestamp',
  MaxBps = 'maxBps',
  Name = 'name',
  Rates = 'rates',
  Symbol = 'symbol',
  TotalAssets = 'totalAssets',
  TotalDebt = 'totalDebt',
  TotalSupply = 'totalSupply',
  TotalUtilisationRate = 'totalUtilisationRate',
  Version = 'version'
}

export type Withdraw = {
  __typename?: 'Withdraw';
  assets: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  caller: Scalars['Bytes'];
  id: Scalars['Bytes'];
  owner: Scalars['Bytes'];
  receiver: Scalars['Bytes'];
  shares: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type Withdraw_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Withdraw_Filter>>>;
  assets?: InputMaybe<Scalars['BigInt']>;
  assets_gt?: InputMaybe<Scalars['BigInt']>;
  assets_gte?: InputMaybe<Scalars['BigInt']>;
  assets_in?: InputMaybe<Array<Scalars['BigInt']>>;
  assets_lt?: InputMaybe<Scalars['BigInt']>;
  assets_lte?: InputMaybe<Scalars['BigInt']>;
  assets_not?: InputMaybe<Scalars['BigInt']>;
  assets_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  caller?: InputMaybe<Scalars['Bytes']>;
  caller_contains?: InputMaybe<Scalars['Bytes']>;
  caller_gt?: InputMaybe<Scalars['Bytes']>;
  caller_gte?: InputMaybe<Scalars['Bytes']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']>>;
  caller_lt?: InputMaybe<Scalars['Bytes']>;
  caller_lte?: InputMaybe<Scalars['Bytes']>;
  caller_not?: InputMaybe<Scalars['Bytes']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  or?: InputMaybe<Array<InputMaybe<Withdraw_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  receiver?: InputMaybe<Scalars['Bytes']>;
  receiver_contains?: InputMaybe<Scalars['Bytes']>;
  receiver_gt?: InputMaybe<Scalars['Bytes']>;
  receiver_gte?: InputMaybe<Scalars['Bytes']>;
  receiver_in?: InputMaybe<Array<Scalars['Bytes']>>;
  receiver_lt?: InputMaybe<Scalars['Bytes']>;
  receiver_lte?: InputMaybe<Scalars['Bytes']>;
  receiver_not?: InputMaybe<Scalars['Bytes']>;
  receiver_not_contains?: InputMaybe<Scalars['Bytes']>;
  receiver_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  shares?: InputMaybe<Scalars['BigInt']>;
  shares_gt?: InputMaybe<Scalars['BigInt']>;
  shares_gte?: InputMaybe<Scalars['BigInt']>;
  shares_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shares_lt?: InputMaybe<Scalars['BigInt']>;
  shares_lte?: InputMaybe<Scalars['BigInt']>;
  shares_not?: InputMaybe<Scalars['BigInt']>;
  shares_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Withdraw_OrderBy {
  Assets = 'assets',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  Caller = 'caller',
  Id = 'id',
  Owner = 'owner',
  Receiver = 'receiver',
  Shares = 'shares',
  TransactionHash = 'transactionHash'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type VaultBySymbolQueryVariables = Exact<{
  symbol: Scalars['String'];
}>;


export type VaultBySymbolQuery = { __typename?: 'Query', vaults: Array<{ __typename?: 'Vault', address: string, name: string, symbol: string, decimals: number, fundAssets: bigint, fundAssetsUSD: bigint, asset: { __typename?: 'Token', address: string, name: string, symbol: string, decimals: number, price: { __typename?: 'Price', value: bigint, decimals: number } }, rates: Array<{ __typename?: 'InterestRate', perBlock: bigint, apy: { __typename?: 'RewardAPY', yearly: bigint } }> }> };

export type GetVaultsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVaultsQuery = { __typename?: 'Query', vaults: Array<{ __typename?: 'Vault', address: string, name: string, symbol: string, decimals: number, fundAssets: bigint, fundAssetsUSD: bigint, asset: { __typename?: 'Token', address: string, name: string, symbol: string, decimals: number, price: { __typename?: 'Price', value: bigint, decimals: number } }, rates: Array<{ __typename?: 'InterestRate', perBlock: bigint, apy: { __typename?: 'RewardAPY', yearly: bigint } }> }> };

export type GetVaultsSymbolsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVaultsSymbolsQuery = { __typename?: 'Query', vaults: Array<{ __typename?: 'Vault', symbol: string }> };


export const VaultBySymbolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VaultBySymbol"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vaults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"symbol"},"value":{"kind":"Variable","name":{"kind":"Name","value":"symbol"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"side"},"value":{"kind":"EnumValue","value":"LENDER"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBlock"}},{"kind":"Field","name":{"kind":"Name","value":"apy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearly"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"fundAssets"}},{"kind":"Field","name":{"kind":"Name","value":"fundAssetsUSD"}}]}}]}}]} as unknown as DocumentNode<VaultBySymbolQuery, VaultBySymbolQueryVariables>;
export const GetVaultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVaults"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vaults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"name"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"rates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"side"},"value":{"kind":"EnumValue","value":"LENDER"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"perBlock"}},{"kind":"Field","name":{"kind":"Name","value":"apy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearly"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"fundAssets"}},{"kind":"Field","name":{"kind":"Name","value":"fundAssetsUSD"}}]}}]}}]} as unknown as DocumentNode<GetVaultsQuery, GetVaultsQueryVariables>;
export const GetVaultsSymbolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVaultsSymbols"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vaults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"name"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"asc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}}]}}]}}]} as unknown as DocumentNode<GetVaultsSymbolsQuery, GetVaultsSymbolsQueryVariables>;
import { bigIntPolicy } from "../policies/bigIntPolicy";

export const scalarTypePolicies = {
  AdminChanged: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  Approval: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy, value: bigIntPolicy } },
  AuthorizedOperator: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  BeaconUpgraded: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  BorrowerDebtManagementReported: {
    fields: {
      blockNumber: bigIntPolicy,
      blockTimestamp: bigIntPolicy,
      debtPayment: bigIntPolicy,
      freeFunds: bigIntPolicy,
      fundsGiven: bigIntPolicy,
      fundsTaken: bigIntPolicy,
      loss: bigIntPolicy,
    },
  },
  Burned: { fields: { amount: bigIntPolicy, blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  ContractAdminChanged: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  ContractBeaconUpgraded: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  ContractUpgraded: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  Deposit: {
    fields: { assets: bigIntPolicy, blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy, shares: bigIntPolicy },
  },
  Initialized: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  InterestRate: { fields: { maturityBlock: bigIntPolicy, perBlock: bigIntPolicy } },
  LockedProfitReleaseRateChanged: {
    fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy, rate: bigIntPolicy },
  },
  Minted: { fields: { amount: bigIntPolicy, blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  OwnershipTransferred: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  Paused: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  Price: { fields: { value: bigIntPolicy } },
  RevokedOperator: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  RewardAPY: { fields: { daily: bigIntPolicy, monthly: bigIntPolicy, weekly: bigIntPolicy, yearly: bigIntPolicy } },
  Sent: { fields: { amount: bigIntPolicy, blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  StrategyAdded: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy, debtRatio: bigIntPolicy } },
  StrategyRemoved: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  StrategyReturnedToQueue: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  StrategyRevoked: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  Transfer: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy, value: bigIntPolicy } },
  Unpaused: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  Upgraded: { fields: { blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy } },
  Vault: {
    fields: {
      debtRatio: bigIntPolicy,
      fundAssets: bigIntPolicy,
      fundAssetsUSD: bigIntPolicy,
      lastReportTimestamp: bigIntPolicy,
      maxBps: bigIntPolicy,
      totalAssets: bigIntPolicy,
      totalDebt: bigIntPolicy,
      totalSupply: bigIntPolicy,
      totalUtilisationRate: bigIntPolicy,
    },
  },
  Withdraw: {
    fields: { assets: bigIntPolicy, blockNumber: bigIntPolicy, blockTimestamp: bigIntPolicy, shares: bigIntPolicy },
  },
};
