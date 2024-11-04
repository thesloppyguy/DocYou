"use client";

import Select from "../base/select";
import NavigationMenuDemo from "./nav";

const Header = () => {
  return (
    <div className="flex flex-1 items-center justify-between px-4 py-2">
      <div className="flex items-center gap-1">
        <Select />
        /
        <Select />
      </div>
      <div className="flex items-center flex-shrink-0">
        <NavigationMenuDemo />
      </div>
    </div>
  );
};
export default Header;
