import classNames from "@/utils/classnames";
import * as RadixLabel from "@radix-ui/react-label";
import React from "react";

export type LabelProps = {
  label: string;
  htmlFor: string;
  className?: string;
} & RadixLabel.LabelProps;

const Label = ({ label, htmlFor, className, ...props }: LabelProps) => {
  return (
    <RadixLabel.Root
      className={classNames(
        "flex text-[15px] font-medium leading-[35px] items-center justify-between text-sm",
        className
      )}
      htmlFor={htmlFor}
      {...props}
    >
      {label}
    </RadixLabel.Root>
  );
};

export default Label;
