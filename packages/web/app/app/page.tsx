"use client";

import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types";
import styles from "./page.module.scss";
import heading from "../components/heading/heading";
import Content from "./content/en.mdx";
import { NextUIProvider, createTheme } from "@nextui-org/react";

const components: MDXComponents = {
  h1: heading.H1,
  h2: heading.H2,
};

const theme = createTheme({
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
    },
  },
});

export default function App() {
  return (
    <main className={styles.main}>
      <MDXProvider components={components}>
        <NextUIProvider theme={theme} disableBaseline={true}>
          <Content />
        </NextUIProvider>
      </MDXProvider>
    </main>
  );
}
