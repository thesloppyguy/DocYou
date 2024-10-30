"use client";
import Drawer from "@/app/components/base/drawer";
import type { IDrawerProps } from "@/app/components/base/drawer";

type IFloatRightContainerProps = {
  isMobile: boolean;
  children?: React.ReactNode;
} & IDrawerProps;

const FloatRightContainer = ({
  isMobile,
  children,
  isOpen,
  ...drawerProps
}: IFloatRightContainerProps) => {
  return (
    <div>
      {isMobile && (
        <Drawer isOpen={isOpen} {...drawerProps}>
          {children}
        </Drawer>
      )}
      {!isMobile && isOpen && <div>{children}</div>}
    </div>
  );
};

export default FloatRightContainer;
