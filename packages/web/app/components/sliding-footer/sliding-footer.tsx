"use client";

import React from "react";
import styles from "./sliding-footer.module.scss";

interface Props {
  children: React.ReactNode;
  footer: React.ReactNode;
}

// Optional: set a default value to prevent scroll bar jitter
const minFooterHeight = 450;

const SlidingFooter: React.FC<Props> = ({ children, footer }) => {
  const footerRef = React.useRef<HTMLDivElement>(null);

  const [margin, setMargin] = React.useState(minFooterHeight);

  React.useEffect(() => {
    // Set content's margin as footer's height
    const onResize = () => {
      const { current: footer } = footerRef;
      setMargin(max(footer?.offsetHeight ?? 0, minFooterHeight));
    };

    // Initial calculation
    onResize();

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <div className={styles.content} style={{ marginBottom: `${margin}px` }}>
        {children}
      </div>
      <div
        ref={footerRef}
        className={styles.footer}
        style={{ minHeight: `${minFooterHeight}px` }}
      >
        {footer}
      </div>
    </>
  );
};

export default SlidingFooter;

/** Find maximum of two number */
function max(a: number, b: number): number {
  return a > b ? a : b;
}

