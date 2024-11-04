import React from "react";

import "./style.css";
import { Spinner } from "@radix-ui/themes";
type ILoadingProps = {
  type?: "area" | "app";
};
const Loading = ({}: ILoadingProps = { type: "area" }) => {
  return (
    <div className={`flex w-full justify-center items-center h-full}`}>
      <Spinner size="3" />
    </div>
  );
};
export default Loading;
