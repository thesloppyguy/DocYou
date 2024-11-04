import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Avatar from "../../base/avatar";
import { RiSettings5Line } from "@remixicon/react";

const NavigationMenuDemo = () => {
  return (
    <NavigationMenu.Root className="relative flex justify-end">
      <NavigationMenu.List className="center m-0 flex list-none rounded-md items-center gap-1">
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className="block select-none rounded px-3 py-2 text-sm font-medium leading-none text-violet11 no-underline outline-none  focus:shadow-[0_0_0_2px] focus:shadow-violet7"
            href="/dashboard"
          >
            Dashboard
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className="block select-none rounded px-3 py-2 text-sm font-medium leading-none text-violet11 no-underline outline-none  focus:shadow-[0_0_0_2px] focus:shadow-violet7"
            href="/playground"
          >
            Playground
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className="block select-none rounded px-3 py-2 text-sm font-medium leading-none text-violet11 no-underline outline-none  focus:shadow-[0_0_0_2px] focus:shadow-violet7"
            href="/api"
          >
            API Reference
          </NavigationMenu.Link>
        </NavigationMenu.Item>
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
export default NavigationMenuDemo;
