import React from "react";

export interface LocaleContextState {
    current: string;
}

/** 
 * Allow to define or change current locale,
 * abstraction unti NextJS does not support it
 * */
export const LocaleContext = React.createContext<LocaleContextState>({
    current: 'en',
})

export const useLocale = () => React.useContext(LocaleContext);