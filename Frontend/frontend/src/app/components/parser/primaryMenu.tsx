import React, { FC } from "react";
import Button from "../base/button";
import Select from "../base/select";
import {
  RiAddLine,
  RiBrushLine,
  RiDownloadLine,
  RiEditLine,
  RiKeyLine,
  RiUploadLine,
} from "@remixicon/react";
import Tooltip from "../base/tooltip";
import { Parser } from "@/models/parser";

interface IPrimaryMenuProps {
  parser: Parser[];
}

const PrimaryMenu: FC<IPrimaryMenuProps> = ({}) => {
  return (
    <div className="flex w-full h-full justify-between">
      <div className="flex gap-2">
        <Select />
        <Tooltip tip="Create Parser">
          <Button className="bg-transparent">
            <RiAddLine size="24" />
          </Button>
        </Tooltip>
      </div>
      <div className="flex gap-2">
        <Tooltip tip="Download Response">
          <Button className="bg-transparent md:hidden block">
            <RiUploadLine size="16" />
          </Button>
        </Tooltip>
        <Tooltip tip="Download Response">
          <Button className="bg-transparent">
            <RiDownloadLine size="16" />
          </Button>
        </Tooltip>
        <Tooltip tip="Clear">
          <Button className="bg-transparent">
            <RiBrushLine size="16" />
          </Button>
        </Tooltip>
        <Tooltip tip="API Keys">
          <Button className="bg-transparent">
            <RiKeyLine size="16" />
          </Button>
        </Tooltip>
        <Tooltip tip="Edit Parser">
          <Button className="bg-transparent">
            <RiEditLine size="16" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default PrimaryMenu;
