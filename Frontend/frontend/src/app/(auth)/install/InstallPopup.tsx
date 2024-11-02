"use client";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useRouter } from "next/navigation";

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/app/components/base/loading";
import classNames from "@/utils/classnames";
import Button from "@/app/components/base/button";

import {
  fetchInitValidateStatus,
  fetchSetupStatus,
  setup,
} from "@/service/common";
import type {
  InitValidateStatusResponse,
  SetupStatusResponse,
} from "@/models/common";
import { Box, Heading, IconButton } from "@radix-ui/themes";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import Input from "@/app/components/base/input";

const validPassword = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

const accountFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "login.error.emailInValid" })
    .email("login.error.emailInValid"),
  name: z.string().min(1, { message: "login.error.nameEmpty" }),
  password: z
    .string()
    .min(8, {
      message: "login.error.passwordLengthInValid",
    })
    .regex(validPassword, "login.error.passwordInvalid"),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

const InstallPopup = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      password: "",
      email: "",
    },
  });

  const onSubmit: SubmitHandler<AccountFormValues> = async (data) => {
    await setup({
      body: {
        ...data,
      },
    });
    router.push("/signin");
  };

  const handleSetting = async () => {
    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    fetchSetupStatus().then((res: SetupStatusResponse) => {
      if (res.status === "Finished") {
        localStorage.setItem("setup_status", "finished");
        window.location.href = "/signin";
      } else {
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
          {t("login.setAdminAccount")}
        </Heading>
      </div>
      <div className="grow mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <Box className="p-4 rounded-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="my-2 flex items-center justify-between text-sm font-medium text-gray-900"
              >
                {t("login.email")}
              </label>
              <div className="mt-1">
                <Input
                  {...register("email")}
                  placeholder={t("login.emailPlaceholder") || ""}
                />
                {errors.email && (
                  <span className="text-red-400 text-sm">
                    {t(`${errors.email?.message}`)}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="name"
                className="my-2 flex items-center justify-between text-sm font-medium text-gray-900"
              >
                {t("login.name")}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Input
                  {...register("name")}
                  placeholder={t("login.namePlaceholder") || ""}
                />
              </div>
              {errors.name && (
                <span className="text-red-400 text-sm">
                  {t(`${errors.name.message}`)}
                </span>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="my-2 flex items-center justify-between text-sm font-medium text-gray-900"
              >
                {t("login.password")}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
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

              <div
                className={classNames("mt-1 text-xs text-gray-500", {
                  "text-red-400 !text-sm": errors.password,
                })}
              >
                {t("login.error.passwordInvalid")}
              </div>
            </div>

            <div>
              <Button variant="soft" className="w-full" onClick={handleSetting}>
                {t("login.installBtn")}
              </Button>
            </div>
          </form>
        </Box>
      </div>
    </>
  );
};

export default InstallPopup;
