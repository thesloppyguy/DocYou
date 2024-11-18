import React, { FC } from "react";
import Select from "../base/select";

interface IPresetSelector {
  setSchema: React.Dispatch<React.SetStateAction<any>>;
}

const PresetSelector: FC<IPresetSelector> = ({ setSchema }) => {
  return (
    <div className="flex w-full h-full">
      <Select className="w-full" />
    </div>
  );
};

export default PresetSelector;
