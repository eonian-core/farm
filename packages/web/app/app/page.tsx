"use client";

import styles from "./page.module.scss";
import Form from "./form/form";
import { Suspense } from "react";
import PageLoader from "../components/page-loader/page-loader";

export default function App() {
  return (
    <main className={styles.main}>
      <Form />
    </main>
  );
}
