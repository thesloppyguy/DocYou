"use client";
import React from "react";
import Avatar from "../../base/avatar";
import Button from "../../base/button";
import { navItems, navTabs, NavType } from "@/constant";
import { useTranslation } from "react-i18next";
import { RiSettings5Line } from "@remixicon/react";
import SideBar from "../../sidebar";
import { useRouter } from "next/navigation";

const MobileNav = ({
  setOpen,
  selected,
  setSelected,
  current,
  setCurrent,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selected: NavType;
  setSelected: React.Dispatch<React.SetStateAction<NavType>>;
  current: string;
  setCurrent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div className="flex flex-col h-full">
      <div className="flex h-[40px] justify-around p-3">
        {navItems.map((item) => (
          <Button
            key={item}
            className={`bg-transparent ${
              selected === item ? "bg-[#46464C]" : "bg-transparent"
            }`}
            onClick={() => {
              setSelected(item);
              setCurrent(navTabs[item][0]);
              router.push(`/${item}/${navTabs[item][0]}`);
            }}
          >
            {t(`common.${item}Title`)}
          </Button>
        ))}
      </div>
      <SideBar
        setOpen={setOpen}
        path={selected}
        current={current}
        setCurrent={setCurrent}
      />
      <div className="w-full h-[64px] flex justify-between p-3">
        <div className="content-center">
          <a href="/settings/profile">
            <RiSettings5Line />
          </a>
        </div>
        <Avatar
          size={"1"}
          fallback={"Sahil"}
          avatar={
            "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
          }
        />
      </div>
    </div>
  );
};
export default MobileNav;
