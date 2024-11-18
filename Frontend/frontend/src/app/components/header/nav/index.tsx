import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Avatar from "../../base/avatar";
import { RiSettings5Line, RiMenu3Line, RiCloseLine } from "@remixicon/react";
import { navItems, navTabs, NavType } from "@/constant";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const Navigation = ({
  mobile = false,
  isOpen,
  setOpen,
  setSelected,
  setCurrent,
}: {
  mobile?: boolean;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelected: React.Dispatch<React.SetStateAction<NavType>>;
  setCurrent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  if (mobile)
    return (
      <div
        className="rounded-lg p-1 cursor-pointer"
        onClick={() => setOpen(!isOpen)}
      >
        {!isOpen ? <RiMenu3Line /> : <RiCloseLine />}
        <div className="w-full h-full rounded-lg bg-slate-700"></div>
      </div>
    );
  return (
    <NavigationMenu.Root className="relative flex justify-end">
      <NavigationMenu.List className="center m-0 flex list-none rounded-md items-center gap-1">
        {navItems.map((item) => (
          <NavigationMenu.Item key={item}>
            <button
              className="cursor-pointer block select-none rounded px-3 py-2 text-sm font-medium leading-none text-violet11 no-underline outline-none  focus:shadow-[0_0_0_2px] focus:shadow-violet7"
              onClick={() => {
                setSelected(item);
                setCurrent(navTabs[item][0]);
                router.push(`/${item}/${navTabs[item][0]}`);
              }}
            >
              {t(`common.${item}Title`)}
            </button>
          </NavigationMenu.Item>
        ))}
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className="block select-none rounded px-3 py-2 text-sm font-medium leading-none text-violet11 no-underline outline-none  focus:shadow-[0_0_0_2px] focus:shadow-violet7"
            href="/settings/general"
          >
            <RiSettings5Line />
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Avatar
            size={"1"}
            fallback={"Sahil"}
            avatar={
              "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
            }
          />
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};
export default Navigation;
