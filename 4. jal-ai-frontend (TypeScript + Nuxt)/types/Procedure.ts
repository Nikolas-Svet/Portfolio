interface IProcedureItem {
    heading: string;
    subItems: string[];
}

export interface IProcedure {
    title: string;
    items: IProcedureItem[];
}