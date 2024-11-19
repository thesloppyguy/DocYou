import React, { FC } from "react";
import Select from "../base/select";
import { Schema, Parser } from "@/models/parser";
import Button from "../base/button";

interface IPresetSelector {
  schema: Schema;
  parser: Parser | null;
  setSchema: React.Dispatch<React.SetStateAction<any>>;
}

const PresetSelector: FC<IPresetSelector> = ({}) => {
  return (
    <div className="flex w-full h-full gap-2">
      <div className="w-[50%] px-2">
        <Select className="w-full" />
      </div>
      <div className="w-[50%]  px-2">
        <Button className="w-full">Save</Button>
      </div>
    </div>
  );
};

export default PresetSelector;
