'use client'

import React from 'react'
import { ThemeProvider } from 'next-themes'
import { CssBaseline, NextUIProvider, createTheme } from '@nextui-org/react'
import { useServerInsertedHTML } from 'next/navigation'

interface Props {
  children: React.ReactNode
}

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    colors: {
      primaryLight: 'var(--color-primary-200)',
      primaryLightHover: 'var(--color-primary-300)',
      primaryLightActive: 'var(--color-primary-400)',
      primaryLightContrast: 'var(--color-primary-600)',
      primary: 'var(--color-primary-500)',
      primaryBorder: 'var(--color-primary-500)',
      primaryBorderHover: 'var(--color-primary-600)',
      primarySolidHover: 'var(--color-primary-700)',
      primarySolidContrast: 'var(--color-text-300)',
      primaryShadow: 'var(--color-primary-500)',
      secondary: 'var(--color-secondary-500)',
      secondaryBorder: 'var(--color-secondary-500)',
      secondaryBorderHover: 'var(--color-secondary-600)',
      secondarySolidHover: 'var(--color-secondary-700)',
      secondarySolidContrast: 'var(--color-text-300)',
      secondaryShadow: 'var(--color-secondary-500)',
      darkLight: 'var(--color-dark-200)',
      darkLightHover: 'var(--color-dark-300)',
      darkLightActive: 'var(--color-dark-400)',
      darkLightContrast: 'var(--color-dark-600)',
      dark: 'var(--color-dark-500)',
      darkBorder: 'var(--color-dark-500)',
      darkBorderHover: 'var(--color-dark-600)',
      darkSolidHover: 'var(--color-dark-700)',
      darkSolidContrast: 'var(--color-text-300)',
      darkShadow: 'var(--color-dark-500)',
      backgroundContrast: 'var(--color-dark-500)',
    },
  },
})

function NextThemeProvider({ children }: Props) {
  useServerInsertedHTML(() => <>{CssBaseline.flush()}</>)

  // For some reason "useServerInsertedHTML" inserts NextUI styles several times (To <head /> and <body />),
  // what breaks the element styles. We can find these <style /> elements and remove one of them.
  React.useEffect(() => {
    document.body.querySelectorAll('#stitches').forEach((element) => {
      element.remove()
    })
  }, [])

  return (
    <ThemeProvider
      forcedTheme="dark"
      attribute="class"
      value={{
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider disableBaseline={true}>{children}</NextUIProvider>
    </ThemeProvider>
  )
}

export default NextThemeProvider
