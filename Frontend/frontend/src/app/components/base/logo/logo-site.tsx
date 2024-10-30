import type { FC } from "react";
import classNames from "classnames";
import Image from "next/image";
type LogoSiteProps = {
  className?: string;
};

const LogoSite: FC<LogoSiteProps> = ({ className }) => {
  return (
    <Image
      src="/logo/logo-site.png"
      className={classNames("block w-auto h-12", className)}
      alt="logo"
      width={48}
      height={48}
    />
  );
};

export default LogoSite;
