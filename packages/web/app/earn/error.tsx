"use client";

import IconWarning from "../components/icons/icon-warning";
import styles from "./layout.module.scss";

export default function Error({ error }: { error: Error }) {
  return (
    <div className={styles.error}>
      <IconWarning width="3em" height="3em" />
      <div className={styles.errorMessage}>
        Error occured: <b>{error.message}</b>
      </div>
    </div>
  );
}
