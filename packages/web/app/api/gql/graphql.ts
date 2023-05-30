/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  BigDecimal: any;
  BigInt: any;
};

export type Query = {
  __typename?: 'Query';
  /** Fetches a Vault by a specific symbol (token's name). */
  vaultBySymbol?: Maybe<Vault>;
  /** Fetches an array of Vault objects. */
  vaults: Array<Vault>;
};


export type QueryVaultBySymbolArgs = {
  symbol: Scalars['String'];
};

/** Represents the underlying asset stored in a vault. */
export type UnderlyingAsset = {
  __typename?: 'UnderlyingAsset';
  /** The blockchain address of the asset. */
  address: Scalars['String'];
  /** The number of decimal places for the asset. */
  decimals: Scalars['Int'];
  /** The name of the asset. */
  name: Scalars['String'];
  /** The symbol of the asset. */
  symbol: Scalars['String'];
};

/** Represents a financial vault storing assets and managing them. */
export type Vault = {
  __typename?: 'Vault';
  /** The blockchain address of the vault. */
  address: Scalars['String'];
  /** The number of decimal places for the vault's assets. */
  decimals: Scalars['Int'];
  /** The interest rate applied to the assets in the vault. */
  interestRate: Scalars['BigDecimal'];
  /** The timestamp of the last harvest event (in seconds since Unix epoch). */
  lastHarvestTime: Scalars['BigInt'];
  /** The name of the vault. */
  name: Scalars['String'];
  /** The symbol of the vault. */
  symbol: Scalars['String'];
  /** The total balance of the vault. */
  totalBalance: Scalars['BigDecimal'];
  /** The underlying asset stored in the vault. */
  underlyingAsset: UnderlyingAsset;
};

export type GetVaultsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVaultsQuery = { __typename?: 'Query', vaults: Array<{ __typename?: 'Vault', totalBalance: any, interestRate: any, lastHarvestTime: any, address: string, name: string, symbol: string, decimals: number, underlyingAsset: { __typename?: 'UnderlyingAsset', address: string, name: string, symbol: string, decimals: number } }> };


export const GetVaultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVaults"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vaults"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"underlyingAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalBalance"}},{"kind":"Field","name":{"kind":"Name","value":"interestRate"}},{"kind":"Field","name":{"kind":"Name","value":"lastHarvestTime"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}}]}}]}}]} as unknown as DocumentNode<GetVaultsQuery, GetVaultsQueryVariables>;