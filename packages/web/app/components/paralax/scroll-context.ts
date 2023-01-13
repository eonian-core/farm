// loaded in sync, keep it small
import { createContext, useCallback, useContext, useState, WheelEventHandler } from "react"

/** Context which track scroll of the page */
export const ScrollTopContext = createContext(0)

/** Return currect scroll top of the page */
export const useScrollTopContext = () => useContext(ScrollTopContext)

/** 
 * DOM EventTarget interface not contain all props which real event target object have
 * This interface add them
 * */
export interface RealEventTarget extends EventTarget {
    parentNode?: RealEventTarget
    nodeName: string
    /** the number of pixels that an element's content is scrolled vertically. */
    scrollTop?: number
}

export type WhheelEventHandler = WheelEventHandler<HTMLHtmlElement & HTMLElement>

/** nodeName which <html> tag have */
const HtmlTagNodeName = 'HTML';

/** 
 * Allow to track scrollTop of page 
 * @returns 
 *  scrollTop - current scrollTop of page
 *  onWhell expect to be set to: main, body, html or any element which take whole page
 * */
export const useScroll = (): [number, WhheelEventHandler] => {
    const [scrollTop, setY] = useState(0)

    const onWhell: WhheelEventHandler = useCallback(({ target }) => {
        if (!isRealEventTarget(target)) {
            return
        }

        // In our case only html tag will have scroll bar and correct scrollTop respectively
        // will search it through parents of event target
        const { scrollTop: newScrollTop } = searchParent(target, HtmlTagNodeName)

        setY(old => newScrollTop === undefined ? old : newScrollTop)
    }, [])

    return [scrollTop, onWhell]
}

export const isRealEventTarget = (target?: EventTarget): target is RealEventTarget => {
    return !!target && 'nodeName' in target
}

/** Simple recursion to find target parent which match nodeName */
export function searchParent(target: RealEventTarget, nodeName: string): RealEventTarget {
    const { parentNode } = target
    if (target.nodeName === nodeName || !isRealEventTarget(parentNode)) {
        // can cause incorrect behaivor if parentNode not exists, but probably never will happen
        return target
    }

    if (parentNode.nodeName === nodeName) {
        return parentNode
    }

    return searchParent(parentNode, nodeName)
}
