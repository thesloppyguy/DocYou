"use client";
import DocumentPreview from "@/app/components/parser/documentPreview";
import DocumentResponse from "@/app/components/parser/documentResponse";
import PresetSelector from "@/app/components/parser/presetSelector";
import PrimaryMenu from "@/app/components/parser/primaryMenu";
import ResponseSchema from "@/app/components/parser/responseSchema";
import { Parser, Schema } from "@/models/parser";
import { useEffect, useState } from "react";

const Parsers = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parser, setParsers] = useState<Parser[]>([]);
  const [currentParser, setCurrentParsers] = useState<Parser | null>(null);
  const [schema, setSchema] = useState<Schema>({ fields: [], tables: [] });
  const [response, setResponse] = useState<any>({});
  useEffect(() => {
    if (currentParser) {
      // fetch schema
      setSchema({ fields: [], tables: [] });
    }
  }, [currentParser]);
  useEffect(() => {
    // fetch parser
    setParsers([]);
    setCurrentParsers(null);
  }, []);
  return (
    <div className="flex flex-row h-full">
      <div className="flex flex-col flex-grow h-full">
        <div className="flex w-full p-2 h-[56px] border-b-[1px] border-r-[1px] border-black">
          <PrimaryMenu parser={parser} />
        </div>
        <div className="flex flex-grow flex-col border-r-[1px] border-black">
          <div className="p-2 md:flex hidden h-[50%]">
            <DocumentPreview file={file} setFile={setFile} />
          </div>
          <div className="flex p-2 flex-grow">
            <DocumentResponse response={response} />
          </div>
        </div>
      </div>
      <div className="hidden flex-col w-[40vw] h-full sm:flex">
        <div className="flex p-2 h-[56px] border-b-[1px] border-black">
          <PresetSelector
            setSchema={setSchema}
            schema={schema}
            parser={currentParser}
          />
        </div>
        <div className="flex p-2 max-h-[calc(100vh-130px)]">
          <ResponseSchema
            file={file}
            schema={schema}
            setSchema={setSchema}
            parser={currentParser}
            setResponse={setResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default Parsers;
