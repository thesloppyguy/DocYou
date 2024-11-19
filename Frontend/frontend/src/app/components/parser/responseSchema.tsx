import React from "react";
import { useTranslation } from "react-i18next";
import { Parser, Schema, SchemaFields, SchemaTabels } from "@/models/parser";
import { Button, Card } from "@radix-ui/themes";
import { RiAddLine, RiDeleteBinLine } from "@remixicon/react";
import Input from "../base/input";
import Select from "../base/select";

interface ResponseSchemaProps {
  file: File | null;
  schema: Schema;
  setSchema: React.Dispatch<React.SetStateAction<Schema>>;
  parser: Parser | null;
  setResponse: React.Dispatch<React.SetStateAction<any>>;
}

const SchemaField: React.FC<{
  field: SchemaFields;
  onEdit: (field: SchemaFields) => void;
  onDelete: () => void;
}> = React.memo(({ field, onEdit, onDelete }) => (
  <Card className="mb-2 p-2">
    <div className="flex items-center justify-between px-1 gap-2">
      <div className="flex-1">
        <div className="flex gap-2">
          <Input
            className="font-medium"
            value={field.name}
            placeholder="Name"
            onChange={(e) => onEdit({ ...field, name: e.target.value })}
          />
          <Select />
          <Input
            className="font-medium"
            value={field.format}
            placeholder="Format"
            onChange={(e) => onEdit({ ...field, format: e.target.value })}
          />
        </div>
        <Input
          placeholder="Description"
          className="text-sm text-gray-600 mt-1"
          value={field.description}
          onChange={(e) => onEdit({ ...field, description: e.target.value })}
        />
      </div>
      <div className="flex gap-4">
        <Button variant="ghost" size="1" onClick={onDelete}>
          <RiDeleteBinLine size={16} />
        </Button>
      </div>
    </div>
  </Card>
));

SchemaField.displayName = "SchemaField";

const TableSection: React.FC<{
  table: SchemaTabels;
  onAddField: (tableName: string) => void;
  onEditTable: (name: string) => void;
  onDeleteTable: () => void;
  onEditField: (fieldIndex: number, field: SchemaFields) => void;
  onDeleteField: (fieldIndex: number) => void;
}> = React.memo(
  ({
    table,
    onEditTable,
    onAddField,
    onDeleteTable,
    onEditField,
    onDeleteField,
  }) => (
    <Card className="mb-4">
      <div className="py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="w-full">
            <Input
              placeholder="Table Name"
              className="text-lg font-semibold"
              value={table.name}
              onChange={(e) => onEditTable(e.target.value)}
            />
          </div>
          <div className="flex">
            <Button variant="ghost" size="1" onClick={onDeleteTable}>
              <RiDeleteBinLine size={16} />
            </Button>
          </div>
        </div>
      </div>
      <Card>
        {table.fields.map((field, index) => (
          <SchemaField
            key={field.name}
            field={field}
            onEdit={(newField) => onEditField(index, newField)}
            onDelete={() => onDeleteField(index)}
          />
        ))}
        <Button
          className="w-full mt-2"
          variant="outline"
          onClick={() => onAddField(table.name)}
        >
          <RiAddLine className="mr-2" size={16} />
          Add Field to Table
        </Button>
      </Card>
    </Card>
  )
);

TableSection.displayName = "TableSection";

export const ResponseSchema: React.FC<ResponseSchemaProps> = ({
  schema,
  setSchema,
}) => {
  const { t } = useTranslation();
  const handleAddField = React.useCallback(() => {
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
  }, [setSchema]);

  const handleEditField = (
    fieldIndex: number,
    data: {
      name: string;
      type: string;
      format: string;
      description: string;
    },
    tableIndex?: number
  ) => {
    setSchema((prevSchema) => {
      if (typeof tableIndex === "undefined") {
        const newFields = [...prevSchema.fields];
        newFields[fieldIndex] = {
          ...newFields[fieldIndex],
          ...data,
          type: data.type as SchemaFields["type"],
        };
        return { ...prevSchema, fields: newFields };
      } else {
        const newTables = [...prevSchema.tables];
        const table = newTables[tableIndex];
        table.fields[fieldIndex] = {
          ...table.fields[fieldIndex],
          ...data,
          type: data.type as SchemaFields["type"],
        };
        return { ...prevSchema, tables: newTables };
      }
    });
  };
  const handleDeleteField = (fieldIndex: number, tableIndex?: number) => {
    setSchema((prevSchema) => {
      if (typeof tableIndex === "undefined") {
        const newFields = prevSchema.fields.filter(
          (_, index) => index !== fieldIndex
        );
        return { ...prevSchema, fields: newFields };
      } else {
        const newTables = [...prevSchema.tables];
        const table = newTables[tableIndex];
        table.fields = table.fields.filter((_, index) => index !== fieldIndex);
        return { ...prevSchema, tables: newTables };
      }
    });
  };

  const handleAddTable = React.useCallback(() => {
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
  }, [setSchema]);

  const handleEditTable = (tableIndex: number, name: string) => {
    setSchema((prevSchema) => {
      const newTables = [...prevSchema.tables];
      newTables[tableIndex] = {
        ...newTables[tableIndex],
        name: name,
      };
      return { ...prevSchema, tables: newTables };
    });
  };

  const handleDeleteTable = (tableIndex: number) => {
    console.log(tableIndex);
    setSchema((prevSchema) => ({
      ...prevSchema,
      tables: prevSchema.tables.filter((_, index) => index !== tableIndex),
    }));
  };

  const handleAddTableField = React.useCallback(
    (tableName: string) => {
      setSchema((prevSchema) => ({
        ...prevSchema,
        tables: prevSchema.tables.map((table) =>
          table.name === tableName
            ? {
                ...table,
                fields: [
                  ...table.fields,
                  {
                    name: `Field ${table.fields.length + 1}`,
                    type: "text",
                    format: "",
                    description: "",
                  },
                ],
              }
            : table
        ),
      }));
    },
    [setSchema]
  );

  return (
    <div className="p-4 pt-0 flex w-full flex-col gap-4 overflow-y-auto">
      <h2 className="text-xl font-bold">{t("parser.responseSchema")}</h2>

      <section>
        <h3 className="text-lg font-semibold mb-2">Fields</h3>
        {schema.fields.map((field, index) => (
          <SchemaField
            key={field.name}
            field={field}
            onEdit={(newField) => {
              handleEditField(index, newField);
            }}
            onDelete={() => {
              handleDeleteField(index);
            }}
          />
        ))}
        <Button className="w-full" variant="outline" onClick={handleAddField}>
          <RiAddLine className="mr-2" size={16} />
          Add Field
        </Button>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Tables</h3>
        {schema.tables.map((table, tableIndex) => (
          <TableSection
            key={table.name}
            table={table}
            onAddField={handleAddTableField}
            onEditTable={(name) => handleEditTable(tableIndex, name)}
            onDeleteTable={() => {
              handleDeleteTable(tableIndex);
            }}
            onEditField={(fieldIndex, field) => {
              handleEditField(fieldIndex, field, tableIndex);
            }}
            onDeleteField={(fieldIndex: number) => {
              handleDeleteField(fieldIndex, tableIndex);
            }}
          />
        ))}
        <Button className="w-full" variant="outline" onClick={handleAddTable}>
          <RiAddLine className="mr-2" size={16} />
          Add Table
        </Button>
      </section>
    </div>
  );
};

export default React.memo(ResponseSchema);
