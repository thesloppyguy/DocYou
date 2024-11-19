"use client";

import { useState } from "react";
import Select from "../base/select";
import Navigation from "./nav";
import MobileNav from "./mobile-nav";
import { NavType } from "@/constant";
const Header = ({
  selected,
  current,
  setSelected,
  setCurrent,
}: {
  selected: NavType;
  current: string;
  setSelected: React.Dispatch<React.SetStateAction<NavType>>;
  setCurrent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 w-full">
        <div className="flex items-center gap-1">
          <Select />
        </div>
        <div className="hidden sm:flex items-center flex-shrink-0">
          <Navigation
            setOpen={setOpen}
            isOpen={isOpen}
            setSelected={setSelected}
            setCurrent={setCurrent}
          />
        </div>
        <div className="flex sm:hidden items-center flex-shrink-0">
          <Navigation
            mobile={true}
            setOpen={setOpen}
            isOpen={isOpen}
            setSelected={setSelected}
            setCurrent={setCurrent}
          />
        </div>
      </div>
      {isOpen && (
        <div className="top-[42px] w-full h-[94vh] flex grow p-2 absolute sm:hidden z-[1]">
          <div className="bg-[#202123] rounded-lg h-full w-full">
            <MobileNav
              setOpen={setOpen}
              selected={selected}
              setSelected={setSelected}
              current={current}
              setCurrent={setCurrent}
            />
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
