import React, { FC } from "react";

interface IDocumentPreviewProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}
const DocumentPreview: FC<IDocumentPreviewProps> = ({ file, setFile }) => {
  return <div>DocumentPreview</div>;
};

export default DocumentPreview;
