import styles from "./collapse.module.scss";
import React from "react";
import clsx from "clsx";

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
}

const CollapseContext = React.createContext<CollapseContextState>({
  isOpen: false,
  onHeaderClick: () => {}
});

export const useCollapseContext = () => React.useContext(CollapseContext);

export default function Collapse({ index = 0, children, open }: CollapseProp) {
  const [isOpen, setIsOpen] = React.useState(open);
  const toggleOpen = React.useCallback(() => setIsOpen(!isOpen), [isOpen]);

  return (
    <div className={styles.container}>
      <div
        tabIndex={index}
        className={clsx("collapse-arrow rounded-box collapse border border-base-300 bg-base-100", {
          'collapse-open': isOpen,
          'collapse-close': !isOpen
        })}
      >
        <CollapseContext.Provider value={{ isOpen, onHeaderClick: toggleOpen }}>
          {children}
        </CollapseContext.Provider>
      </div>
    </div>
  );
}
