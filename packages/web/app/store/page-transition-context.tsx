import React from "react";

///
/// Reducer
///

interface State {
  pageLoading: string | null;
}

interface Action {
  type: "SET_PAGE_LOADING";
  payload: string | null;
}

const initialState: State = {
  pageLoading: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PAGE_LOADING": {
      return { ...state, pageLoading: action.payload };
    }
    default:
      throw Error("Unknown action type");
  }
}

///
/// Context
///

type ContextType = [state: State, dispatch: React.Dispatch<Action>];

const defaultContextValue: ContextType = [initialState, () => {}];

const Context = React.createContext(defaultContextValue);

interface Props {
  children: React.ReactNode;
}

export function PageTransitionContextProvider({ children }: Props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
}

export function usePageTransitionContext() {
  return React.useContext(Context);
}
