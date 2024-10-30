import React from "react";
import type { ReactNode } from "react";
import SwrInitor from "@/app/components/swr-initor";
// import { AppContextProvider } from "@/context/app-context";
import GA, { GaType } from "@/app/components/base/ga";
// import { EventEmitterContextProvider } from "@/context/event-emitter";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <GA gaType={GaType.admin} />
      <SwrInitor>
        {/* <AppContextProvider> */}
        {/* <EventEmitterContextProvider> */}
        {children}
        {/* </EventEmitterContextProvider> */}
        {/* </AppContextProvider> */}
      </SwrInitor>
    </>
  );
};

export const metadata = {
  title: "DocYous",
};

export default Layout;
