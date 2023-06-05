"use client";

import IconWarning from "./components/icons/icon-warning";

export default function Error({ error }: { error: Error }) {
  return (
    <main>
      <IconWarning width="3em" height="3em" />
      <div>
        Global Error occured: <b>{error.message}</b>
      </div>
    </main>
  );
}
