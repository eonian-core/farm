import React from "react";

type ContextType = [pageLoading: string | null, setPageLoading: (value: string) => void];

const defaultContextValue: ContextType = [null, () => {}];

const Context = React.createContext(defaultContextValue);

interface Props {
  children: React.ReactNode;
}

export function PageTransitionContextProvider({ children }: Props) {
  const state = React.useState<string | null>(null);
  return (
    <Context.Provider value={state}>{children}</Context.Provider>
  );
}

export function usePageTransitionContext() {
  return React.useContext(Context);
}
