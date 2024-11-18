"use client";
import React, { useState } from "react";
import type { ReactNode } from "react";
import SwrInitor from "@/app/components/swr-initor";
import GA, { GaType } from "@/app/components/base/ga";
import Header from "../components/header";
import { navItems, navTabs, NavType } from "@/constant";
import SideBar from "../components/sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  const [selected, setSelected] = useState<NavType>(navItems[0]);
  const [current, setCurrent] = useState(navTabs[selected][0]);
  return (
    <div className="flex flex-col h-[100vh]">
      <GA gaType={GaType.admin} />
      <SwrInitor>
        <Header
          current={current}
          setCurrent={setCurrent}
          setSelected={setSelected}
          selected={selected}
        />
        <div className="flex w-full grow">
          <div className="flex flex-row w-full">
            <div className="w-[250px] sm:flex hidden">
              <SideBar
                path={selected}
                current={current}
                setCurrent={setCurrent}
              />
            </div>
            {children}
          </div>
        </div>
      </SwrInitor>
    </div>
  );
};

export default Layout;
