"use client";

import React from "react";
import { Web3OnboardProvider } from "@web3-onboard/react";

import web3Onboard from "../web3-onboard";
import NextThemeProvider from "./next-theme";
import { Provider } from "react-redux";
import { store } from "../store/store";

interface Props {
  locale: string;
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <Provider store={store}>
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        <NextThemeProvider>{children}</NextThemeProvider>
      </Web3OnboardProvider>
    </Provider>
  );
}
