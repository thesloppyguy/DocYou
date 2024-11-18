import { Parser } from "@/models/parser";
import React, { FC } from "react";

interface IDocumentResponse {
  response: any;
}

const DocumentResponse: FC<IDocumentResponse> = ({ response }) => {
  return <div>DocumentResponse</div>;
};

export default DocumentResponse;
