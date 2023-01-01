// icon:infinity | CSS Icons https://css.gg/ | Astrit
import * as React from "react";

function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" height="2rem" width="2rem" {...props}>
      <path
        fill="currentColor"
        d="M8.121 9.879l2.083 2.083.007-.006 1.452 1.452.006.006 2.122 2.122a5 5 0 100-7.072l-.714.714 1.415 1.414.713-.713a3 3 0 110 4.242l-2.072-2.072-.007.006-3.59-3.59a5 5 0 100 7.07l.713-.713-1.414-1.414-.714.713a3 3 0 110-4.242z"
      />
    </svg>
  );
}

export default Logo;