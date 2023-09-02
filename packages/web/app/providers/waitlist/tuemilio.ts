
export interface ITuemilio {
    (type: string, value?: any): void
}


/** Typed wrapper of Tuemilio */
export interface ITumelioWrapper {
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

/**
 * Setup Tuemilio provider and adds its script
 * Based on 
 *  https://gist.github.com/dmarman/309c31f0939fd3095cab0e884442ec77
 *  https://docs.tuemilio.com/javascript-api/#installation
 */
export const setupTuemilio = (): ITumelioWrapper => {
    /* eslint-disable */
    // @ts-ignore
    (function (t, u, e, m, i, l, io) {
        // @ts-ignore
        t['TuemilioObject'] = m; t[m] = t[m] || function () { (t[m].q = t[m].q || []).push(arguments); };
        // @ts-ignore
        t[m].id = '2f53a74c-b5df-4a4f-beb0-a26b5544fb5a'; l = u.createElement(e), io = u.getElementsByTagName(e)[0];
        // @ts-ignore
        l.id = m; l.src = i; l.async = 1; io.parentNode.insertBefore(l, io);
        // @ts-ignore
    }(window, document, 'script', 'Tuemilio', 'https://tuemilio.com/assets/js/modal/4.0/tuemilio-modal.js'));

    /* eslint-enable */

    const tuemilio = (window as any).Tuemilio as (ITuemilio | undefined);

    if (!tuemilio) {
        throw new Error("Tuemilio is undefined");
    }

    tuemilio('init', {
        form: {
            disabled: true
        }
    });
    tuemilio('sendVisit');

    tuemilio('onDashboardData', (dashboard: any) => {
        console.log(dashboard)
    });

    return {
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

}