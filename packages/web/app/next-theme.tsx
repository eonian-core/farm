"use client";

import { CssBaseline, NextUIProvider, createTheme } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { useServerInsertedHTML } from "next/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {
      primaryLight: "var(--color-primary-200)",
      primaryLightHover: "var(--color-primary-300)",
      primaryLightActive: "var(--color-primary-400)",
      primaryLightContrast: "var(--color-primary-600)",
      primary: "var(--color-primary-500)",
      primaryBorder: "var(--color-primary-500)",
      primaryBorderHover: "var(--color-primary-600)",
      primarySolidHover: "var(--color-primary-700)",
      primarySolidContrast: "var(--color-text-300)",
      primaryShadow: "var(--color-primary-500)",
      darkLight: "var(--color-dark-200)",
      darkLightHover: "var(--color-dark-300)",
      darkLightActive: "var(--color-dark-400)",
      darkLightContrast: "var(--color-dark-600)",
      dark: "var(--color-dark-500)",
      darkBorder: "var(--color-dark-500)",
      darkBorderHover: "var(--color-dark-600)",
      darkSolidHover: "var(--color-dark-700)",
      darkSolidContrast: "var(--color-text-300)",
      darkShadow: "var(--color-dark-500)",

      backgroundContrast: "var(--color-dark-500)",
    },
  },
});

const NextThemeProvider = ({ children }: Props) => {
  useServerInsertedHTML(() => {
    return <>{CssBaseline.flush()}</>;
  });

  return (
    <ThemeProvider
      defaultTheme="dark"
      attribute="class"
      value={{
        dark: darkTheme.className,
      }}
    >
      <NextUIProvider disableBaseline={true}>{children}</NextUIProvider>
    </ThemeProvider>
  );
};

export default NextThemeProvider;
