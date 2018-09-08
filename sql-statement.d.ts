/**
 * Tiny SQL Statement Builder
 */

declare class SQL {
    "?": string;
    "??": string;
    "???": string;
    "null": string;

    constructor(query?: string, ...bindings: string[]);

    query(): string;

    bindings(): string[];

    prepend(query: string, ...bindings: string[]): this;

    prepend(sql: this): this;

    append(query: string, ...bindings: string[]): this;

    append(sql: this): this;

    appendList(placeholder: string, array: string[], separator?: string): this;

    appendPairs(placeholder: string, object: any, separator?: string): this;
}

declare module sql_statement {
    class Pg extends SQL {
    }

    class mysql extends SQL {
    }
}

declare interface sql_statement extends SQL {
}

export = sql_statement;
