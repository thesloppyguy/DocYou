import { Parser, Schema } from "@/models/parser";
import React, { FC } from "react";
import Button from "../base/button";
import { RiAddLine } from "@remixicon/react";
import { useTranslation } from "react-i18next";

interface IResponseSchema {
  file: File | null;
  schema: Schema;
  setSchema: React.Dispatch<React.SetStateAction<Schema>>;
  parser: Parser | null;
  setResponse: React.Dispatch<React.SetStateAction<any>>;
}

const ResponseSchema: FC<IResponseSchema> = ({ schema, setSchema }) => {
  const { t } = useTranslation();
  const handleAddField = () => {
    setSchema((prevSchema) => ({
      ...prevSchema,
      fields: [
        ...prevSchema.fields,
        {
          name: `Field ${prevSchema.fields.length + 1}`,
          type: "text",
          format: "",
          description: "",
        },
      ],
    }));
  };
  const handleAddTable = () => {
    setSchema((prevSchema) => ({
      ...prevSchema,
      tables: [
        ...prevSchema.tables,
        {
          name: `Table ${prevSchema.tables.length + 1}`,
          fields: [],
        },
      ],
    }));
  };
  const handleAddTableField = () => {};
  return (
    <div className="p-2 flex w-full flex-col gap-2 overflow-y-auto">
      <div>{t("parser.responseSchema")}</div>
      <div>
        {schema.fields.map((field) => (
          <div key={field.name}>{field.name}</div>
        ))}
      </div>
      <div>
        <Button onClick={handleAddField} className="w-full cursor-pointer">
          {" "}
          <RiAddLine size="16" /> Add Field
        </Button>
      </div>
      <div>
        {schema.tables.map((table) => (
          <div key={table.name}>
            <div>{table.name}</div>
            <div>
              {table.fields.map((field) => (
                <div key={field.name}>{field.name}</div>
              ))}
            </div>
            <div>
              <Button
                className="w-full cursor-pointer"
                onClick={handleAddTableField}
              >
                <RiAddLine size="16" /> Add Field to Table
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Button onClick={handleAddTable} className="w-full cursor-pointer">
          {" "}
          <RiAddLine size="16" /> Add Table
        </Button>
      </div>
    </div>
  );
};

export default ResponseSchema;
