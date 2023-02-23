import styles from "./collapse.module.scss";
import React, { RefObject, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useLocationHash } from "./use-location-hash";

interface CollapseProp {
  /** Need for correct tab order */
  index: number;
  children: React.ReactNode;
  /** Set open at start */
  open: boolean;
}

export interface CollapseContextState {
  isOpen: boolean;
  onHeaderClick: () => void
  /** Id which can be used by anchor link to navigate to collapse */
  id: string | null;
  /** Allow header to say which id belongs to the collapse */
  setCollapseId: (id: string) => void;
}

const CollapseContext = React.createContext<CollapseContextState>({
  isOpen: false,
  onHeaderClick: () => {},
  id: null,
  setCollapseId: () => {},
});

export const useCollapseContext = () => React.useContext(CollapseContext);

export default function Collapse({ index = 0, children, open }: CollapseProp) {
  const { isOpen, setIsOpen, toggleOpen } = useIsOpen(open);

  const [id, setId] = useState<string | null>(null)
  const hash = useLocationHash()

  // for scrollIntoView
  const ref = useRef<HTMLDivElement>(null);
  
  // open collapse if hash matches id
  // react only when hash or id changes
  useEffect(() => {
    if(typeof hash !== 'string' || typeof id !== 'string') 
      return

    if (id === hash) {
      setIsOpen(true)
      scrollIntoView(ref)
    }
    
    // important to react only when hash or id changes
    // prevent accidential opening or scroll on re-render
  }, [hash, id])

  return (
    <div className={styles.container} ref={ref}>
      <div
        tabIndex={index}
        className={clsx("collapse-arrow rounded-box collapse border border-base-300 bg-base-100", {
          'collapse-open': isOpen,
          'collapse-close': !isOpen
        })}
      >
        <CollapseContext.Provider value={{ 
            isOpen, onHeaderClick: toggleOpen, 
            id, setCollapseId: setId 
            }} >
          {children}
        </CollapseContext.Provider>
      </div>
    </div>
  );
}

const useIsOpen = (open: boolean) => {
  const [isOpen, setIsOpen] = useState(open);
  const toggleOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  return { isOpen, setIsOpen, toggleOpen };
}

export const scrollIntoView = (ref: RefObject<HTMLDivElement>) => {
  ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
}