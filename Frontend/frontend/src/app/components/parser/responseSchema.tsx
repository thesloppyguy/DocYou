import { Parser, Schema, SchemaFields } from "@/models/parser";
import React, { FC } from "react";
import Button from "../base/button";
import { RiAddLine } from "@remixicon/react";

interface IResponseSchema {
  file: File | null;
  schema: Schema;
  setSchema: React.Dispatch<React.SetStateAction<Schema>>;
  parser: Parser | null;
  setResponse: React.Dispatch<React.SetStateAction<any>>;
}

const ResponseSchema: FC<IResponseSchema> = ({ schema, setSchema, parser }) => {
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
    <div className="flex flex-col h-full w-full">
      <div className="flex w-full flex-col">
        <div className="flex flex-col gap-2 p-1 max-h-[620px] overflow-y-scroll">
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
      </div>

      <div className="flex gap-2 h-[40px] w-full justify-around p-2 border-t-[1px] border-black">
        <Button className="min-w-[30%] cursor-pointer">Save Schema</Button>
        <Button className="min-w-[30%] cursor-pointer">Save & Submit</Button>
      </div>
    </div>
  );
};

export default ResponseSchema;
