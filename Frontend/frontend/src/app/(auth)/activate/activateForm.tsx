"use client";
import { useCallback, useState } from "react";
import { useContext } from "use-context-selector";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import cn from "classnames";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Button from "@/app/components/base/button";
import { activateMember, invitationCheck } from "@/service/common";
import Toast from "@/app/components/base/toast";
import Loading from "@/app/components/base/loading";
import I18n from "@/context/i18n";
import Label from "@/app/components/base/label";
const validPassword = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

const ActivateForm = () => {
  const { t } = useTranslation();
  const { setLocaleOnClient } = useContext(I18n);
  const searchParams = useSearchParams();
  const workspaceID = searchParams.get("workspace_id");
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const checkParams = {
    url: "/activate/check",
    params: {
      ...(workspaceID && { workspace_id: workspaceID }),
      ...(email && { email }),
      token,
    },
  };
  const { data: checkRes, mutate: recheck } = useSWR(
    checkParams,
    invitationCheck,
    {
      revalidateOnFocus: false,
    }
  );

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const showErrorMessage = useCallback((message: string) => {
    Toast.notify({
      type: "error",
      message,
    });
  }, []);

  const valid = useCallback(() => {
    if (!name.trim()) {
      showErrorMessage(t("login.error.nameEmpty"));
      return false;
    }
    if (!password.trim()) {
      showErrorMessage(t("login.error.passwordEmpty"));
      return false;
    }
    if (!validPassword.test(password)) {
      showErrorMessage(t("login.error.passwordInvalid"));
      return false;
    }

    return true;
  }, [name, password, showErrorMessage, t]);

  const handleActivate = useCallback(async () => {
    if (!valid()) return;
    try {
      await activateMember({
        url: "/activate",
        body: {
          workspace_id: workspaceID,
          email,
          token,
          name,
          password,
        },
      });
      setShowSuccess(true);
    } catch {
      recheck();
    }
  }, [
    email,
    name,
    password,
    recheck,
    setLocaleOnClient,
    token,
    valid,
    workspaceID,
  ]);

  return (
    <div
      className={cn(
        "flex flex-col items-center w-full grow justify-center",
        "px-6",
        "md:px-[108px]"
      )}
    >
      {!checkRes && <Loading />}
      {checkRes && !checkRes.is_valid && (
        <div className="flex flex-col md:w-[400px]">
          <div className="w-full mx-auto">
            <div className="mb-3 flex justify-center items-center w-20 h-20 p-5 rounded-[20px] border border-gray-100 shadow-lg text-[40px] font-bold">
              🤷‍♂️
            </div>
            <h2 className="text-[32px] font-bold text-gray-900">
              {t("login.invalid")}
            </h2>
          </div>
          <div className="w-full mx-auto mt-6">
            <Button className="w-full !text-sm">
              <a href="">{t("login.explore")}</a>
            </Button>
          </div>
        </div>
      )}
      {checkRes && checkRes.is_valid && !showSuccess && (
        <div className="flex flex-col md:w-[400px]">
          <div className="w-full mx-auto">
            <div
              className={`mb-3 flex justify-center items-center w-20 h-20 p-5 rounded-[20px] border border-gray-100 shadow-lg text-[40px] font-bold`}
            ></div>
            <h2 className="text-[32px] font-bold text-gray-900">
              {`${t("login.join")} ${checkRes.data.workspace_name}`}
            </h2>
            <p className="mt-1 text-sm text-gray-600 ">
              {`${t("login.joinTipStart")} ${checkRes.data.workspace_name} ${t(
                "login.joinTipEnd"
              )}`}
            </p>
          </div>

          <div className="w-full mx-auto mt-6">
            <div className="bg-white">
              {/* username */}
              <div className="mb-5">
                <Label label={t("login.name")} htmlFor="name" />

                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("login.namePlaceholder") || ""}
                    className={
                      "appearance-none block w-full rounded-lg pl-[14px] px-3 py-2 border border-gray-200 hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400 caret-primary-600 sm:text-sm pr-10"
                    }
                  />
                </div>
              </div>
              {/* password */}
              <div className="mb-5">
                <Label label={t("login.password")} htmlFor="password" />
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login.passwordPlaceholder") || ""}
                    className={
                      "appearance-none block w-full rounded-lg pl-[14px] px-3 py-2 border border-gray-200 hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400 caret-primary-600 sm:text-sm pr-10"
                    }
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                    >
                      {showPassword ? "❌" : "🔎"}
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {t("login.error.passwordInvalid")}
                </div>
              </div>

              <div>
                <Button className="w-full !text-sm" onClick={handleActivate}>
                  {`${t("login.join")} ${checkRes.data.workspace_name}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {checkRes && checkRes.is_valid && showSuccess && (
        <div className="flex flex-col md:w-[400px]">
          <div className="w-full mx-auto">
            <div className="mb-3 flex justify-center items-center w-20 h-20 p-5 rounded-[20px] border border-gray-100 shadow-lg text-[40px] font-bold">
              <CheckCircleIcon className="w-10 h-10 text-[#039855]" />
            </div>
            <h2 className="text-[32px] font-bold text-gray-900">
              {`${t("login.activatedTipStart")} ${
                checkRes.data.workspace_name
              } ${t("login.activatedTipEnd")}`}
            </h2>
          </div>
          <div className="w-full mx-auto mt-6">
            <Button className="w-full !text-sm">
              <a href="/signin">{t("login.activated")}</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivateForm;
