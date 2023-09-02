import { useEffect } from "react";
import { isInBrowser } from "../browser";
import { ITumelioWrapper, setupTuemilio } from "./tuemilio";

export const useTuemilio = (setState: (state: ITumelioWrapper) => void) => {
    useEffect(() => {

        try {

            console.log("useTuemilio", isInBrowser())

            if (!isInBrowser()) {
                return
            }

            const newState = setupTuemilio()
            console.log("useTuemilio.newState", newState)
            setState(newState);

        } catch (e) {
            console.warn(e, "Tuemilio setup failed")
            // TODO: add logrocket tracking if need
        }
    }, [])
}