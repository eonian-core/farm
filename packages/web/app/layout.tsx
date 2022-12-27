'use client';

import { Roboto } from "@next/font/google";

import Navigation from './components/navigation/navigation'
import './globals.scss'
import './tailwind.css'

const roboto = Roboto({ 
  subsets: ['latin', 'cyrillic'], 
  weight: ['400', '500', '700', '900'],
  display: 'auto' // force to show font anyway
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={roboto.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
