import SideBar from "@/app/components/sidebar";
import { navTabs } from "@/constant";
import React from "react";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="flex grow p-2">
        <div className="bg-[#202123] rounded-lg w-full">{children}</div>
      </div>
    </>
  );
};

export const metadata = {
  title: "DocYous",
};

export default Layout;
