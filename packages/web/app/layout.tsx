'use client';

import { Roboto } from "@next/font/google";
import { useState } from "react";
import clsx from "clsx";
import { GoogleAnalytics } from "nextjs-google-analytics";


import './globals.scss'
import './tailwind.css'

import Navigation from './components/navigation/navigation'
import SlidingFooter from "./components/sliding-footer/sliding-footer";
import Footer from "./components/footer/footer";
import styles from './layout.module.scss'
import { useGesture } from "react-use-gesture";
import { ScrollContext } from "./(landing)/views/problem/problem";


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
  const [scrollTop, setY] = useState(0)

  const bind = useGesture({ onWheel: ({ event, movement: [x, y], direction: [dx, dy] }) => {
          // @ts-ignore
          console.log('scroll', event, x, y, dx, dy, event?.target?.scrollTop, event.pageY, event.screenY, scrollTop)
          if(!event.target) {
            return
          }
          const html = getHtmlParent(event.target)
          // @ts-ignore
          console.log('html', html.scrollTop)
          // @ts-ignore
          setY(html.scrollTop)
        },
      }
    )

    
  const locale = 'en';
  return (
    <html lang={locale}  {...bind()}>
      <GoogleAnalytics trackPageViews />
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={clsx(roboto.className, {[styles.menuOpen]: isMenuOpen})}>
        <ScrollContext.Provider value={scrollTop}>
          <Navigation onStateChange={setMenuState}/>
          <SlidingFooter footer={<Footer locale={locale} />}>
            {children}
          </SlidingFooter>
        </ScrollContext.Provider>
      </body>
    </html>
  );
}

function getHtmlParent(target: EventTarget): EventTarget {
  // @ts-ignore
  if(!target.parentNode) {
    return target
  }
  // @ts-ignore
  if(target.parentNode.nodeName === 'HTML'){
    // @ts-ignore
    return target.parentNode
  }

  // @ts-ignore
  return getHtmlParent(target.parentNode)
}
