import React, { FC } from "react";
import { useTranslation } from "react-i18next";

interface IDocumentPreviewProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}
const DocumentPreview: FC<IDocumentPreviewProps> = ({}) => {
  const { t } = useTranslation();
  return <div>{t("parser.documentPreview")}</div>;
};

export default DocumentPreview;
