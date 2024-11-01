import type { FC } from "react";
import React from "react";
import Script from "next/script";

export enum GaType {
  admin = "admin",
  webapp = "webapp",
}

const gaIdMaps = {
  [GaType.admin]: "G-VSDMKHVFZQ",
  [GaType.webapp]: "G-VSDMKHVFZQ",
};

export type IGAProps = {
  gaType: GaType;
};

const GA: FC<IGAProps> = ({ gaType }) => {
  return (
    <div>
      <Script
        strategy="beforeInteractive"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaIdMaps[gaType]}`}
      ></Script>
      <Script
        id="ga-init"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaIdMaps[gaType]}');
          `,
        }}
      ></Script>
    </div>
  );
};
export default React.memo(GA);
