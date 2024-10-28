"use client";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import {
  Text,
  Flex,
  Switch as OriginalSwitch,
  SwitchProps as RadixProps,
} from "@radix-ui/themes";

type SwitchProps = {
  onChangeHandler?: (value: boolean) => void
  label?: string;
  defaultValue?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
} & RadixProps;

const Switch = ({
  label,
  onChangeHandler,
  size = "2",
  defaultValue = false,
  disabled = false,
  className,
  textClassName,
}: SwitchProps) => {
  const [enabled, setEnabled] = useState(defaultValue);
  useEffect(() => {
    setEnabled(defaultValue);
  }, [defaultValue]);
  return (
    <Text as="label" size={size} className={classNames(textClassName)}>
      <Flex gap="2">
        <OriginalSwitch
          size={size}
          checked={enabled}
          className={classNames(className)}
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            setEnabled(!enabled);
            onChangeHandler?.(!enabled);
          }}
        />{" "}
        {label}
      </Flex>
    </Text>
  );
};
export default React.memo(Switch);
