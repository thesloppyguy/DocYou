import classNames from "@/utils/classnames";
import React from "react";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full" style={{ height: `calc(100vh - 56px)` }}>
      {/* Local Nav */}
      <div className="w-[250px] h-full"></div>
      {/* Content */}
      <div className="w-full sm:p-2 lg:p-4 h-full">
        <div
          className={classNames(
            "flex w-full h-full",
            "gap-x-10",
            "justify-center lg:justify-start"
          )}
        >
          <div
            className={classNames(
              "flex w-full h-full flex-col bg-white shadow rounded-2xl shrink-0",
              "space-between"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const metadata = {
  title: "DocYou",
};

export default Layout;
