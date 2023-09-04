import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useTuemilio, TuemilioScript } from './tuemilio';

export interface WaitlistState {
    join: (email: string) => void;
    openDashboard: () => void;
    isJoined: boolean;
}

const defailtContextState: WaitlistState = { join: () => { }, openDashboard: () => {}, isJoined: false }

const WaitlistContext = createContext<WaitlistState>(defailtContextState);

export const WaitlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const tumelio = useTuemilio()

    const join = useCallback((email: string) => {
        tumelio.createSubscriber(email)
    }, [tumelio.createSubscriber]);

    const isJoined = !!tumelio.subscriber

    return (
        <WaitlistContext.Provider value={{ join, isJoined, openDashboard: tumelio.showDashboard }}>
            <TuemilioScript />
            {children}
        </WaitlistContext.Provider>
    );
}

export const useWaitlist = () => useContext(WaitlistContext);


