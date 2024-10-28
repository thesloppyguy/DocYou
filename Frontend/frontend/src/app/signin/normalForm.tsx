import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../components/base/loading";
import MailAndPasswordAuth from "./components/mail-and-password-auth";
import cn from "@/utils/classnames";
import { invitationCheck } from "@/service/common";
import Toast from "@/app/components/base/toast";
import useRefreshToken from "@/hooks/use-refresh-token";

const NormalForm = () => {
  const { getNewAccessToken } = useRefreshToken();
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const consoleToken = decodeURIComponent(
    searchParams.get("access_token") || ""
  );
  const refreshToken = decodeURIComponent(
    searchParams.get("refresh_token") || ""
  );
  const message = decodeURIComponent(searchParams.get("message") || "");
  const invite_token = decodeURIComponent(
    searchParams.get("invite_token") || ""
  );
  const [isLoading, setIsLoading] = useState(true);
  const [workspaceName, setWorkSpaceName] = useState("");

  const isInviteLink = Boolean(invite_token && invite_token !== "null");

  const init = useCallback(async () => {
    try {
      if (consoleToken && refreshToken) {
        localStorage.setItem("console_token", consoleToken);
        localStorage.setItem("refresh_token", refreshToken);
        getNewAccessToken();
        router.replace("/apps");
        return;
      }

      if (message) {
        Toast.notify({
          type: "error",
          message,
        });
      }
      if (isInviteLink) {
        const checkRes = await invitationCheck({
          url: "/activate/check",
          params: {
            token: invite_token,
          },
        });
        setWorkSpaceName(checkRes?.data?.workspace_name || "");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [
    consoleToken,
    refreshToken,
    message,
    router,
    invite_token,
    isInviteLink,
    getNewAccessToken,
  ]);
  useEffect(() => {
    init();
  }, [init]);
  if (isLoading || consoleToken) {
    return (
      <div
        className={cn(
          "flex flex-col items-center w-full grow justify-center",
          "px-6",
          "md:px-[108px]"
        )}
      >
        <Loading type="area" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full mx-auto mt-8">
        {isInviteLink ? (
          <div className="w-full mx-auto">
            <h2 className="title-4xl-semi-bold text-text-primary">
              {t("login.join")}
              {workspaceName}
            </h2>
            <p className="mt-2 body-md-regular text-text-tertiary">
              {t("login.joinTipStart")}
              {workspaceName}
              {t("login.joinTipEnd")}
            </p>
          </div>
        ) : (
          <div className="w-full mx-auto">
            <h2 className="title-4xl-semi-bold text-text-primary">
              {t("login.pageTitle")}
            </h2>
            <p className="mt-2 body-md-regular text-text-tertiary">
              {t("login.welcome")}
            </p>
          </div>
        )}
        <div className="bg-white">
          <MailAndPasswordAuth
            isInvite={isInviteLink}
            allowRegistration={true}
          />
          <span className="system-xs-medium text-components-button-secondary-accent-text">
            {t("login.useVerificationCode")}
          </span>
        </div>
        <div className="w-full block mt-2 system-xs-regular text-text-tertiary">
          {t("login.tosDesc")}
          &nbsp;
          <Link
            className="system-xs-medium text-text-secondary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://dify.ai/terms"
          >
            {t("login.tos")}
          </Link>
          &nbsp;&&nbsp;
          <Link
            className="system-xs-medium text-text-secondary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://dify.ai/privacy"
          >
            {t("login.pp")}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NormalForm;
