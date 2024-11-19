import React, { FC } from "react";
import Button from "../base/button";
import { useTranslation } from "react-i18next";

interface IDocumentResponse {
  response: any;
}

const DocumentResponse: FC<IDocumentResponse> = ({}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-grow h-full">
        {t("parser.documentResponse")}
      </div>
      <div className="w-full gap-2 flex justify-around p-2 border-t-[1px] border-black">
        <Button className="min-w-[30%] cursor-pointer">Submit</Button>
      </div>
    </div>
  );
};

export default DocumentResponse;
