import React from "react";
import { ButtonProps, Button as RadixButton } from "@radix-ui/themes";
import classNames from "@/utils/classnames";
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "solid",
      size = "2",
      loading = false,
      radius = "medium",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <RadixButton
        ref={ref}
        size={size}
        radius={radius}
        loading={loading}
        variant={variant}
        className={classNames(className)}
        {...props}
      >
        {children}
      </RadixButton>
    );
  }
);
Button.displayName = "Button";
export default Button;
