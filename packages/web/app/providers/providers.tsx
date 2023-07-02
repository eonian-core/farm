"use client";

import React from "react";

import NextThemeProvider from "./next-theme";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { WalletWrapperProvider } from "./wallet/wallet-wrapper-provider";
import { ApolloProvider } from "../api";
import { AuthProvider } from "../auth";

interface Props {
  locale: string;
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <ApolloProvider>
      <Provider store={store}>
        <WalletWrapperProvider>
          <AuthProvider>
            <NextThemeProvider>{children}</NextThemeProvider>
          </AuthProvider>
        </WalletWrapperProvider>
      </Provider>
    </ApolloProvider>
  );
}
