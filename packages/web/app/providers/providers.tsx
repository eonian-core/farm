"use client";

import React from "react";

import NextThemeProvider from "./next-theme";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { WalletWrapperProvider } from "./wallet/wallet-wrapper-provider";
import { ApolloProvider } from "../api";

interface Props {
  locale: string;
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <ApolloProvider>
      <Provider store={store}>
        <WalletWrapperProvider>
          <NextThemeProvider>{children}</NextThemeProvider>
        </WalletWrapperProvider>
      </Provider>
    </ApolloProvider>
  );
}
