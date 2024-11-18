export type Parser = {
    id: string;
    name: string;
    limit: string;
};

export type Preset = {
    id: string;
    name: string;
    schema: any;
};



export type Schema = {
    fields: SchemaFields[]
    tables: SchemaTabels[]
}

export type SchemaFields = {
    name: string
    type: 'text' | 'number' | 'date' | 'time'
    format: string
    description: string
}

export type SchemaTabels = {
    name: string
    fields: SchemaFields[]
}