import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useTuemilio, TuemilioScript } from './tuemilio';

export interface WaitlistState {
    join: (email: string) => Promise<void>;
    openDashboard: () => void;
    isJoined: boolean;
}

const defailtContextState: WaitlistState = { join: () => Promise.resolve(), openDashboard: () => {}, isJoined: false }

const WaitlistContext = createContext<WaitlistState>(defailtContextState);

export const WaitlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const tumelio = useTuemilio()

    return (
        <WaitlistContext.Provider value={{ 
            join: tumelio.createSubscriber, 
            isJoined: !!tumelio.subscriber, 
            openDashboard: tumelio.showDashboard 
        }}>
            <TuemilioScript />
            {children}
        </WaitlistContext.Provider>
    );
}

export const useWaitlist = () => useContext(WaitlistContext);


