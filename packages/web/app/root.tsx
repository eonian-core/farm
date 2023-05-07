"use client";

import { Roboto } from "next/font/google";
import { useState } from "react";
import clsx from "clsx";

import "./globals.scss";

import Navigation from "./components/navigation/navigation";
import SlidingFooter from "./components/sliding-footer/sliding-footer";
import Footer from "./components/footer/footer";
import styles from "./layout.module.scss";
import GoogleAnalytics from "./google-analytics";
import { LocaleContext } from "./store/locale";
import PageLoaderTop from "./components/page-loading-top/page-loader-top";
import { PageTransitionContextProvider } from "./store/page-transition-context";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400"],
  display: "block", // force to show font anyway
});

interface Props {
  children: React.ReactNode;
}

export default function Root({ children }: Props) {
  const [isMenuOpen, setMenuState] = useState(false);

  const locale = "en";
  return (
    <html lang={locale}>
      <PageTransitionContextProvider>
        <LocaleContext.Provider value={{ current: locale }}>
          <GoogleAnalytics />

          <body
            className={clsx(roboto.className, {
              [styles.menuOpen]: isMenuOpen,
            })}
          >
            <PageLoaderTop />
            <Navigation onStateChange={setMenuState} />

            <SlidingFooter footer={<Footer />}>{children}</SlidingFooter>
          </body>
        </LocaleContext.Provider>
      </PageTransitionContextProvider>
    </html>
  );
}
