"use client";
import React from "react";
import NavList from "./nav";
import { navTabs, NavType } from "@/constant";

const SideBar = ({
  path,
  current,
  setCurrent,
  setOpen,
}: {
  path: NavType;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  current: string;
  setCurrent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const tabs = navTabs[path];
  return (
    <NavList
      setOpen={setOpen}
      path={path}
      options={tabs}
      current={current}
      setCurrent={setCurrent}
    />
  );
};

export default SideBar;
