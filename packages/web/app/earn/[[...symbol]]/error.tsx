"use client";

import IconWarning from "../../components/icons/icon-warning";
import styles from "./page.module.scss";

export default function Error({ error }: { error: Error }) {
  return (
    <main className={styles.main}>
      <IconWarning width="3em" height="3em" />
      <div className={styles.error}>
        Error occured: <b>{error.message}</b>
      </div>
    </main>
  );
}
