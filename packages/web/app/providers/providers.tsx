"use client";

import React from "react";

import NextThemeProvider from "./next-theme";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { WalletWrapperProvider } from "./wallet/wallet-wrapper-provider";
import { ApolloWrapperProvider } from "../api/apollo-wrapper-provider";

interface Props {
  locale: string;
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <Provider store={store}>
      <ApolloWrapperProvider>
        <WalletWrapperProvider>
          <NextThemeProvider>{children}</NextThemeProvider>
        </WalletWrapperProvider>
      </ApolloWrapperProvider>
    </Provider>
  );
}
