'use client';

import { Roboto } from "@next/font/google";
import { GoogleAnalytics } from "nextjs-google-analytics";

import './globals.scss'
import './tailwind.css'

import Navigation from './components/navigation/navigation'
import SlidingFooter from "./components/sliding-footer/sliding-footer";
import Footer from "./components/footer/footer";


const roboto = Roboto({ 
  subsets: ['latin', 'cyrillic'], 
  weight: ['400', '500', '700', '900'],
  display: 'block' // force to show font anyway
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleAnalytics trackPageViews />
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={roboto.className}>
        <Navigation />
        <SlidingFooter footer={<Footer />}>
          {children}
        </SlidingFooter>
      </body>
    </html>
  );
}
