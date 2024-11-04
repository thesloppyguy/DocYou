"use client";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useRouter } from "next/navigation";

import Loading from "@/app/components/base/loading";
import Toast from "@/app/components/base/toast";
import Button from "@/app/components/base/button";
import {
  fetchInitValidateStatus,
  fetchSetupStatus,
  resetPassword,
} from "@/service/common";
import type {
  InitValidateStatusResponse,
  SetupStatusResponse,
} from "@/models/common";
import { emailRegex } from "@/constant";
import Input from "@/app/components/base/input";
import { Heading, Link, Text } from "@radix-ui/themes";
import Label from "@/app/components/base/label";

const ResetForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const onSubmit = async () => {
    if (!emailRegex.test(email)) {
      Toast.notify({
        type: "error",
        message: t("login.error.emailInValid"),
      });
      return;
    }
    try {
      setIsLoading(true);
      const res = await resetPassword({
        body: {
          email,
        },
      });
      if (res.result === "success") {
        Toast.notify({
          type: "success",
          message: t("login.success.email"),
        });
        router.replace("/signin");
      }
    } catch {
      Toast.notify({
        type: "error",
        message: t("login.error.emailInValid"),
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSetting = async (event: any) => {
    event.preventDefault();
    onSubmit();
  };
  useEffect(() => {
    fetchSetupStatus().then((res: SetupStatusResponse) => {
      if (res.status !== "Finished") {
        fetchInitValidateStatus().then((res: InitValidateStatusResponse) => {
          if (res.status === "No Setup") window.location.href = "/init";
        });
      }
      setLoading(false);
    });
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Heading align="center" as="h2" size="6" mb="4">
          {t("login.setResetPassword")}
        </Heading>
        <Text as="p" size="1" align="left">
          {t("login.setResetPasswordDesc")}
        </Text>
      </div>
      <div className="grow mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={handleSetting}>
          <div className="mb-5">
            <Label label={t("login.email")} htmlFor="email" />
            <div className="mt-1">
              <div className="mt-1">
                <Input
                  placeholder={t("login.emailPlaceholder") || ""}
                  value={email}
                  onChange={(e: any) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex w-full justify-end text-sm text-primary-600 cursor-pointer py-2">
            <Link href="/signin" className="text-sm content-center">
              {t("login.signBtn")}
            </Link>
          </div>
          <div>
            <Button
              className="w-full"
              onClick={handleSetting}
              disabled={isLoading}
            >
              {t("login.resetBtn")}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetForm;
