import {
  RiAccountCircleLine,
  RiAdminLine,
  RiAiGenerate,
  RiAppsLine,
  RiBookLine,
  RiBrainLine,
  RiBugLine,
  RiDatabase2Line,
  RiGitPullRequestLine,
  RiHomeLine,
  RiNotionLine,
  RiScanLine,
} from "@remixicon/react";

export const navIcon = (name: string) => {
  switch (name) {
    case "home":
      return <RiHomeLine />;
    case "usage":
      return <RiNotionLine />;
    case "storage":
      return <RiDatabase2Line />;
    case "apikeys":
      return <RiAppsLine />;
    case "classify":
      return <RiBrainLine />;
    case "parsers":
      return <RiScanLine />;
    case "hil":
      return <RiAdminLine />;
    case "kyc":
      return <RiAccountCircleLine />;
    case "introduction":
      return <RiBookLine />;
    case "authentication":
      return <RiAiGenerate />;
    case "request":
      return <RiGitPullRequestLine />;
    case "debugging":
      return <RiBugLine />;
    default:
      return <></>;
  }
};
