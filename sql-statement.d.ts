/**
 * Tiny SQL Statement Builder
 */

type value = string | number | boolean;

class SQL {
    "?": string;
    "??": string;
    "???": string;
    "null": string;

    constructor(query?: string, ...bindings?: value[]);

    query(): string;

    bindings(): string[];

    prepend(query: string, ...bindings?: value[]): this;

    prepend(sql: this): this;

    append(query: string, ...bindings?: value[]): this;

    append(sql: this): this;

    appendList(placeholder: string, array: string[], separator?: string): this;

    appendPairs(placeholder: string, object: any, separator?: string): this;
}

export class Pg extends SQL {
    //
}

export class mysql extends SQL {
    //
}

export = SQL;
