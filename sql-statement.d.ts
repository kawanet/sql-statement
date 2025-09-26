/**
 * Tiny SQL Statement Builder
 */

type value = string | number | boolean | null | undefined;

declare class SQL {
    "?": string;
    "??": string;
    "???": string;
    "null": string;

    constructor(query?: string, ...bindings: value[]);

    query(): string;

    bindings(): string[];

    prepend(query: string, ...bindings: value[]): this;

    prepend(sql: this): this;

    append(query: string, ...bindings: value[]): this;

    append(sql: this): this;

    appendList(placeholder: string, array: value[], separator?: string): this;

    appendPairs(placeholder: string, object: any, separator?: string): this;
}

declare module SQL {
    class Pg extends SQL {
    }

    class mysql extends SQL {
    }
}

export = SQL;
