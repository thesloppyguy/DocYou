import type { Viewport } from "next";
import I18nServer from "./components/i18n-server";
import BrowserInitor from "./components/browser-initor";
import SentryInitor from "./components/sentry-initor";
import "@radix-ui/themes/styles.css";
import { Theme, ThemePanel } from "@radix-ui/themes";
import "./globals.css";
import { useTheme } from "next-themes";
// import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "DocYou",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  userScalable: false,
};
export const tealBackgroundImageStyle = {
  "--color-background-image-base": "var(--sage-1)",
  "--color-background-image-accent-1": "var(--teal-a7)",
  "--color-background-image-accent-2": "var(--mint-7)",
  "--color-background-image-accent-3": "var(--green-9)",
  "--color-background-image-accent-4": "var(--sky-5)",
  "--color-background-image-accent-5": "var(--crimson-3)",
  "--color-background-image-accent-6": "var(--mint-a5)",
  "--color-background-image-accent-7": "var(--teal-5)",
  position: "absolute",
  zIndex: -1,
} as React.CSSProperties;

const LocaleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang={"en"} className="h-full">
      <head>
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className="h-full select-auto"
        data-api-prefix={process.env.NEXT_PUBLIC_API_PREFIX}
        data-pubic-api-prefix={process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX}
        data-public-edition={process.env.NEXT_PUBLIC_EDITION}
        data-public-support-mail-login={
          process.env.NEXT_PUBLIC_SUPPORT_MAIL_LOGIN
        }
        data-public-sentry-dsn={process.env.NEXT_PUBLIC_SENTRY_DSN}
        data-public-maintenance-notice={
          process.env.NEXT_PUBLIC_MAINTENANCE_NOTICE
        }
        data-public-site-about={process.env.NEXT_PUBLIC_SITE_ABOUT}
        data-public-text-generation-timeout-ms={
          process.env.NEXT_PUBLIC_TEXT_GENERATION_TIMEOUT_MS
        }
      >
        {/* <ThemeProvider attribute="class"> */}
        <BrowserInitor>
          <Theme accentColor="iris" grayColor="sage" appearance={"dark"}>
            <SentryInitor>
              <I18nServer>{children}</I18nServer>
            </SentryInitor>
            {/* <ThemePanel /> */}
          </Theme>
        </BrowserInitor>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
};

export default LocaleLayout;
