"use client";
import React from "react";
import Button from "../../base/button";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { navIcon } from "@/constant/navicons";

const NavList = ({
  path,
  options,
  current,
  setOpen,
  setCurrent,
}: {
  path: string;
  options: string[];
  current: string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <div className="flex-grow p-4">
      <div className="flex flex-col gap-3">
        {options.map((item: string) => (
          <Button
            key={item}
            radius="large"
            className={`cursor-pointer justify-start ${
              current === item ? "bg-[#46464C]" : "bg-transparent"
            }`}
            onClick={() => {
              setCurrent(item);
              router.push(`/${path}/${item}`);
              setOpen && setOpen(false);
            }}
          >
            {navIcon(item)} {t(`common.${path}.${item}`)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NavList;
