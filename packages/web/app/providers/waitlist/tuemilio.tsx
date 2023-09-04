import Script from "next/script"
import { useCallback, useEffect, useState } from "react"
import { isInBrowser } from "../browser"

export interface ITuemilio {
    (type: string, value?: any): void
}


/** Typed wrapper of Tuemilio */
export interface ITumelioWrapper {
    [key: string]: ((...args: any[]) => void) | Object | null
    subscriber: Object | null
    /**
     * With 'createSubscriber', you can add a subscriber to your list. 
     * The only item you need to pass in the argument object is address
     * @param address: String|Required Subscriber's email
     * @param referralId: String The referrer subscriber's ID. 
     *  Will be set automatically, if the parameter is in the URL like example.com?referrerId=xBg3
     */
    createSubscriber: (address: string, referralId?: String) => void
    showDashboard: () => void
    fireConfety: () => void
}

export const TuemilioScript = () => (
    <Script>
        {`
        (function(t,u,e,m,i,l,io){
            t['TuemilioObject']=m;t[m]=t[m]||function(){(t[m].q=t[m].q||[]).push(arguments);};
            t[m].id='2f53a74c-b5df-4a4f-beb0-a26b5544fb5a';l=u.createElement(e),io=u.getElementsByTagName(e)[0];
            l.id=m;l.src=i;l.async=1;io.parentNode.insertBefore(l,io);
            }(window,document,'script','Tuemilio','https://tuemilio.com/assets/js/modal/4.0/tuemilio-modal.js'));
        Tuemilio('init', {
            form: {
                disabled: true
            },
            confetti: {
                disabled: false
            }
        });
        Tuemilio('sendVisit');
        `}
    </Script>
)

/**
 * Setup Tuemilio provider and adds its script
 * Based on 
 *  https://gist.github.com/dmarman/309c31f0939fd3095cab0e884442ec77
 *  https://docs.tuemilio.com/javascript-api/#installation
 */
export const useTuemilio = (): ITumelioWrapper => {
    const isBrowser = isInBrowser();

    // Tuemilio can reference incorrect object during initilisation
    // so need to take it directly from window on each call
    const tuemilio: ITuemilio = (...args: [string, any?]) => {
        if(!isBrowser) {
            return
        }

        const real = (((window as any).Tuemilio || (() => {})) as ITuemilio)

        return real(...args)
    }

    const [subscriber, setSubscriber] = useState<any>(null)

    useEffect(() => {
        console.log('Tuemilio is loaded')

        tuemilio('onDashboardData', (dashboard: any) => {
            console.log('onDashboardData', dashboard)
        });
    
        tuemilio('onSubscriberCreated', function (s: any){
            console.log('onSubscriberCreated', s)
            setSubscriber(s)
        });
    
        tuemilio('onSubscriberIdentified', function (s: any){
            console.log('onSubscriberIdentified', s)
            setSubscriber(s)
        });
    
        tuemilio('onSubscriberUnidentified', function (){
            console.log('onSubscriberUnidentified')
        });
    
        tuemilio('onSubscriberUnauthorized', function (error: any){
            console.log('onSubscriberUnauthorized', error)
        });
    
        tuemilio('onSubscriberUnaccepted', function (error: any){
            console.log('onSubscriberUnaccepted', error)
        });
    
        tuemilio('onDashboardShown', function (error: any){
            console.log('onDashboardShown', error)
        });
    
        tuemilio('onInvalidEmail', function (error: any){
            console.log('onInvalidEmail', error)
        });
    
        tuemilio('onEmptyEmail', function (error: any){
            console.log('onEmptyEmail', error)
        });
    
        tuemilio('onError', function (error: any){
            console.log('onError', error)
        });
    }, [])
    
    const result: Omit<ITumelioWrapper, 'subscriber'> =  {
        createSubscriber: (address, referralId) => {
            console.log('createSubscriber', address, referralId)
            tuemilio('createSubscriber', { address, referralId })
        },
        showDashboard: () => {
            // TODO: make it embeded https://docs.tuemilio.com/javascript-api/#show-dashboard
            console.log('showDashboard')
            tuemilio('showDashboard')
        },
        fireConfety: () => {
            console.log('confetti')
            tuemilio('confetti');
        }
    }

    for (const key of Object.keys(result)) {
        result[key] = useCallback(result[key] as any, [tuemilio]);
    }

    return {
        ...result,
        subscriber,
    } as ITumelioWrapper;
}