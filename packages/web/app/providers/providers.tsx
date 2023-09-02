"use client";

import React from "react";

import NextThemeProvider from "./next-theme";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { WalletWrapperProvider } from "./wallet/wallet-wrapper-provider";
import { AuthProvider } from "../auth";
import { WaitlistProvider } from "./waitlist";

interface Props {
  locale: string;
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <NextThemeProvider>
      <Provider store={store}>
        <WalletWrapperProvider>
          <WaitlistProvider>
            <AuthProvider>{children}</AuthProvider>
          </WaitlistProvider>
        </WalletWrapperProvider>
      </Provider>
    </NextThemeProvider>
  );
}
