import LogRocket from "logrocket";
import React, { useContext } from "react";

interface MonitoringContextValue {
  identify: (uid: string, properties: Record<string, any>) => void;
}

export const MonitoringContext = React.createContext<MonitoringContextValue>({
  identify: () => {},
});

export const MonitoringProvider = ({ children }: React.PropsWithChildren) => {
  React.useEffect(() => {
    const env = process.env.NODE_ENV;
    if (env !== "production") {
      console.debug(`Monitoring is disabled, ENV is not "production" (${env})`);
      return;
    }

    const appId = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID;
    if (appId) {
      LogRocket.init(appId, {
        release: getRelease(),
      });

      const slug = appId.split("/").pop()?.toUpperCase() ?? "-";
      console.debug(`Monitoring is enabled (${slug})`);
      return;
    }
    console.debug("Monitoring is disabled");
  }, []);

  const identify = React.useCallback(
    (uid: string, properties: Record<string, any>) => {
      if (process.env.NODE_ENV !== "production") return;
      LogRocket.identify(uid, properties);
      console.debug("User identification is set");
    },
    []
  );

  return (
    <MonitoringContext.Provider value={{ identify }}>
      {children}
    </MonitoringContext.Provider>
  );
};

export const useMonitoringContext = () => useContext(MonitoringContext);

function getRelease() {
  console.log(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA);
  return process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "unknown_commit";
}
