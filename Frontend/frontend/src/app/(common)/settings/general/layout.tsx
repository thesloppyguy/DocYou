import React from "react";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export const metadata = {
  title: "DocYou",
};

export default Layout;
