import { NextSeo, NextSeoProps } from "next-seo"
import { NEXT_SEO_DEFAULT } from "../next-seo.config"

export interface HeadProps {
  /** Overrode default seo */
  seo?: Partial<NextSeoProps>
}

export default function Head({ seo = {} }: HeadProps = { seo: {}}) {
  return (
    <>
      <NextSeo {...{...NEXT_SEO_DEFAULT, ...seo}} useAppDir={true} />

      <Favicons />
      <Theme />
    </>
  )
}

export const Favicons = () => (
  <>
    <meta content="width=device-width, initial-scale=1" name="viewport" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    <link rel="shortcut icon" href="/favicon.ico" />
  </>
)

export const Theme = () => (
  <>
    <meta name="msapplication-TileColor" content="#181b1b" />
    <meta name="msapplication-config" content="/browserconfig.xml" />

    <meta name="theme-color" content="#181b1b"></meta>
  </>
)