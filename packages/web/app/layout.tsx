'use client';

import { Roboto } from "@next/font/google";
import { useCallback, useState, WheelEventHandler } from "react";
import clsx from "clsx";
import { GoogleAnalytics } from "nextjs-google-analytics"; // TODO: use lazy loading


import './globals.scss'
import './tailwind.css'

import Navigation from './components/navigation/navigation'
import SlidingFooter from "./components/sliding-footer/sliding-footer";
import Footer from "./components/footer/footer";
import styles from './layout.module.scss'
import { ScrollTopContext, useScroll } from "./components/paralax/scroll-context";

const roboto = Roboto({ 
  subsets: ['latin', 'cyrillic'], 
  weight: ['300', '400', '500', '700', '900'],
  display: 'block' // force to show font anyway
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setMenuState] = useState(false);
  // cannot be used on page level, triggers re-render on every scroll
  const [scrollTop, onWheel] = useScroll();
    
  const locale = 'en';
  return (
    <html lang={locale} onWheel={onWheel}>
      <GoogleAnalytics trackPageViews />
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={clsx(roboto.className, {[styles.menuOpen]: isMenuOpen})}>
        <ScrollTopContext.Provider value={scrollTop}>
          <Navigation onStateChange={setMenuState}/>
          
          <SlidingFooter footer={<Footer locale={locale} />}>
            {children}
          </SlidingFooter>
        </ScrollTopContext.Provider>
      </body>
    </html>
  );
}

