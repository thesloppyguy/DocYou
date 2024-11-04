import React from "react";
import type { ReactNode } from "react";
import SwrInitor from "@/app/components/swr-initor";
import GA, { GaType } from "@/app/components/base/ga";
import Header from "../components/header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-[100vw] h-[100vh]">
      <GA gaType={GaType.admin} />
      <SwrInitor>
        <Header />
        <div className="w-full screen-minus-56">{children}</div>
      </SwrInitor>
    </div>
  );
};

export const metadata = {
  title: "DocYou",
};

export default Layout;
