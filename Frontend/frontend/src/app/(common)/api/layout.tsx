import React from "react";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden">
      {/* Local Nav */}
      <div>{children}</div>
      {/* Content */}
      <div>{children}</div>
    </div>
  );
};

export const metadata = {
  title: "DocYous",
};

export default Layout;
