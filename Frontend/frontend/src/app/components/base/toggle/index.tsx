import React, { FC } from "react";
import * as Toggle from "@radix-ui/react-toggle";
import classNames from "@/utils/classnames";

export type TooltipProps = {
    children?: React.ReactNode;
    className?: string;
    };

const ToggleDemo: FC<TooltipProps> = ({ children, className }) => (
	<Toggle.Root
		aria-label="Toggle italic"
		className={classNames(className, "flex size-[35px] items-center justify-center rounded bg-white leading-4 text-mauve11 shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=on]:bg-violet6 data-[state=on]:text-violet12")}
	>
		{children}
	</Toggle.Root>
);

export default ToggleDemo;
