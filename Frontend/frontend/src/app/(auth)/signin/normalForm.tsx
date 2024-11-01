import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { invitationCheck } from "@/service/common";
import Toast from "@/app/components/base/toast";
import useRefreshToken from "@/hooks/use-refresh-token";
import { Box, Flex, Heading, IconButton, Link, Text } from "@radix-ui/themes";
import Loading from "@/app/components/base/loading";
import classNames from "@/utils/classnames";
import { useTranslation } from "react-i18next";
import Input from "@/app/components/base/input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Button from "@/app/components/base/button";

const NormalForm = () => {
  const { t } = useTranslation();
  const { getNewAccessToken } = useRefreshToken();
  const [showPassword, setShowPassword] = React.useState(false);
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
  console.log(workspaceName);
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
  // useEffect(() => {
  //   init();
  // }, [init]);
  if (isLoading || consoleToken) {
    return (
      <div
        className={classNames(
          "flex flex-col items-center w-full grow justify-center",
          "px-6",
          "md:px-[108px]"
        )}
      >
        <Loading type="area" />
      </div>
    );
  }
  const handleSubmit = () => {};
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Heading align="center" as="h2" size="6" mb="4">
          {t("login.signBtn")}
        </Heading>
        <Text as="p" size="1" align="left">
          {t("login.welcome")}
        </Text>
      </div>
      <div className="grow mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <Box className="p-4 rounded-md">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="my-2 flex items-center justify-between text-sm font-medium text-gray-900"
              >
                {t("login.email")}
              </label>
              <div className="mt-1">
                <Input
                  value={""}
                  placeholder={t("login.emailPlaceholder") || ""}
                />
              </div>
            </div>

            <div className="mb-5">
              <div className="flex justify-between">
                <label
                  htmlFor="password"
                  className="my-2 flex items-center justify-between text-sm font-medium text-gray-900"
                >
                  {t("login.password")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm content-center"
                >
                  {t("login.forget")}
                </Link>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Input
                  value={"dawd"}
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.passwordPlaceholder") || ""}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <IconButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 bg-transparent"
                  >
                    {showPassword ? (
                      <EyeSlashIcon width="18" height="18" />
                    ) : (
                      <EyeIcon width="18" height="18" />
                    )}
                  </IconButton>
                </div>
              </div>
              <div className=" w-[100%]"></div>
            </div>

            <Flex mt="6" justify="end" gap="3">
              <Button variant="outline" onClick={() => router.push("/create")}>
                Create an account
              </Button>
              <Button>Sign in</Button>
            </Flex>
          </form>
        </Box>
      </div>
    </>
  );
};

export default NormalForm;
