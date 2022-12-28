import { Roboto } from "@next/font/google";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import EonianLogo from "./logo";

const roboto = Roboto({ subsets: ["latin"], weight: ["500"] });

const LogoWithText = () => {
  return (
    <Link href="/" className="flex flex-row items-center">
      <div className="mr-3 flex-shrink-0">
        <EonianLogo height={30} width={70} />
      </div>
      <div
        className={clsx(
          roboto.className,
          "currentColor uppercase text-gray-300"
        )}
      >
        Eonian
      </div>
    </Link>
  );
};

export default LogoWithText;
