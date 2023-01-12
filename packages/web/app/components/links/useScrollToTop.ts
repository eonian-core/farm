import { useEffect, useCallback } from "react";

export const TOP_ELELEMENT_ID = "top";


/** 
 * Fix issue when page not scrolled on route change 
 * Issue: https://github.com/vercel/next.js/issues/28778
 * Example solution: https://stackoverflow.com/questions/71381766/why-nextjs-link-scroll-to-top-not-working-when-i-change-route
 * */
export default function useScrollToTop(){
    const onRouteChange = useCallback(() => {
        document.getElementById(TOP_ELELEMENT_ID)?.scrollIntoView();
    }, [])

    return [onRouteChange];
}