"use client";
import classNames from "classnames";
import Header from "./_header";
import NormalForm from "./normalForm";
import { Card, Flex } from "@radix-ui/themes";
import { ThemesPanelBackgroundImage } from "@/app/components/background/themesPanelBackgroundImage";

const SignIn = () => {
  return (
    <div>
      <Header />
      <div
        className={classNames(
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
          <NormalForm />
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
