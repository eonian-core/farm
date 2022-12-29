import React from "react";
import Curves from "./curves";

interface Props {
  children: React.ReactNode;
}

const Roadmap: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div>{children}</div>
      <div className="w-full h-96">
        <Curves />
      </div>
    </div>
  );
};

export default Roadmap;
