import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ITumelioWrapper } from './tuemilio';
import { useTuemilio } from './useTuemilio';

export interface WaitlistState {
    join: (email: string) => void;
}

const defailtContextState: WaitlistState = { join: () => { } }

const WaitlistContext = createContext<WaitlistState>(defailtContextState);

const defaulWaitlistState: ITumelioWrapper = {
    createSubscriber: () => {
        // TODO: add default error handling
        alert('Eh :( we have problem to add you waitlist, please contact us on Discord or Telegram')
    },
    showDashboard: () => {},
    fireConfety: () => {}
}

export const WaitlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<ITumelioWrapper>(defaulWaitlistState);
    useTuemilio(setState)

    const join = useCallback((email: string) => {
        console.log('join', state.createSubscriber, email)
        state.createSubscriber(email)
        
        // TODO: fix dashboard to show after join
        state.showDashboard()
        state.fireConfety()
    }, [state.createSubscriber, state.showDashboard, state.fireConfety]);

    return (
        <WaitlistContext.Provider value={{ join }}>
            {children}
        </WaitlistContext.Provider>
    );
}

export const useWaitlist = () => useContext(WaitlistContext);


