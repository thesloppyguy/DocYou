import React from "react";
import style from "../signin/page.module.css";
import InitPasswordPopup from "./InitPasswordPopup";
import classNames from "@/utils/classnames";
import { Card, Flex } from "@radix-ui/themes";
import { ThemesPanelBackgroundImage } from "../components/background/themesPanelBackgroundImage";
import Header from "./_header";

const Install = () => {
  return (
    <div>
      <Header />
      <div
        className={classNames(
          style.background,
          "flex w-full h-full",
          "p-4 lg:p-8",
          "gap-x-20",
          "justify-center lg:justify-start"
        )}
      >
        <Flex
          align="center"
          justify="center"
          position="absolute"
          inset="0"
          overflow="hidden"
          style={{ background: "var(--gray-2)" }}
        >
          <ThemesPanelBackgroundImage id="1" style={{ width: "240%" }} />
        </Flex>
        <Card className="m-auto">
          <InitPasswordPopup />
        </Card>
      </div>
    </div>
  );
};

export default Install;
