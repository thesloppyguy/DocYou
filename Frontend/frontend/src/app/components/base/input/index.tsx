import type { CSSProperties } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  RiCloseCircleFill,
  RiErrorWarningLine,
  RiSearchLine,
} from "@remixicon/react";
import cn from "@/utils/classnames";
import { Flex, TextField } from "@radix-ui/themes";
import { RootProps } from "@radix-ui/themes/dist/esm/components/text-field.js";
import classNames from "@/utils/classnames";

export type InputProps = {
  value: string;
  placeholder: string;
  showLeftIcon?: boolean;
  showClearIcon?: boolean;
  onClear?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  wrapperClassName?: string;
  styleCss?: CSSProperties;
} & RootProps;

const Input = ({
  size = "2",
  variant = "surface",
  disabled,
  destructive,
  showLeftIcon,
  showClearIcon,
  onClear,
  wrapperClassName,
  className,
  styleCss,
  value,
  placeholder,
  onChange,
  ...props
}: InputProps) => {
  const { t } = useTranslation();
  return (
    <Flex className={cn("relative w-full", wrapperClassName)}>
      <TextField.Root
        value={value}
        variant={variant}
        placeholder={
          placeholder ??
          (showLeftIcon
            ? t("common.operation.search") ?? ""
            : t("common.placeholder.input"))
        }
        size={size}
        disabled={disabled}
        onChange={onChange}
        style={styleCss}
        className={classNames("w-full", className)}
        {...props}
      >
        {showLeftIcon && (
          <TextField.Slot>
            <RiSearchLine
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-components-input-text-placeholder"
              )}
            />
          </TextField.Slot>
        )}
        {showClearIcon && (
          <TextField.Slot>
            <div
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 group p-[1px] cursor-pointer"
              )}
              onClick={onClear}
            >
              <RiCloseCircleFill className="w-3.5 h-3.5 text-text-quaternary cursor-pointer group-hover:text-text-tertiary" />
            </div>
          </TextField.Slot>
        )}
      </TextField.Root>
      {destructive && (
        <RiErrorWarningLine className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-destructive-secondary" />
      )}
    </Flex>
  );
};

export default Input;
