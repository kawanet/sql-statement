#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as pg from "pg";

import {Pg as SQL} from "../";

const TESTNAME = __filename.split("/").pop();

const go = process.env.PGHOST || process.env.PGDATABASE;
const DESCRIBE = go ? describe : describe.skip;
const suffix = go ? " testing" : " skipped. To test this, please set PGHOST=127.0.0.1 PGDATABASE=test";

DESCRIBE(TESTNAME + suffix, function () {
    let client: pg.Client;

    before(async () => {
        client = new pg.Client();
        await client.connect();
    });

    const sql1 = new SQL("SELECT ? AS ??", "BAR", "bar");
    it(sql1.query(), async () => {
        const {rows} = await client.query<{ bar: string }>(sql1 + "");
        assert.equal(typeof rows, "object");
        const row = rows[0];
        assert.equal(typeof row, "object");
        assert.equal(row.bar, "BAR");
    });

    const sql2 = new SQL("SELECT ? AS ??", "FOO", "foo");
    it(sql2.query(), async () => {
        const {rows} = await client.query<{ foo: string }>(sql2 + "");
        assert.equal(typeof rows, "object");
        const row = rows[0];
        assert.equal(typeof row, "object");
        assert.equal(row.foo, "FOO");
    });

    // pg library has completely difference style of placeholder
    const sql3 = new SQL("SELECT $1::text AS \"baz\"", "BAZ");
    it(sql3.query(), async () => {
        const {rows} = await client.query.apply(client, sql3);
        assert.equal(typeof rows, "object");
        const row = rows[0];
        assert.equal(typeof row, "object");
        assert.equal(row.baz, "BAZ");
    });

    const sql4 = 'SELECT ? AS "quote"';
    const exp4 = "\"\'\\\"\'\\";
    it("new SQL(" + JSON.stringify(sql4) + ", " + JSON.stringify(exp4) + ")", async () => {
        const sql = new SQL(sql4, exp4);
        const {rows} = await client.query<{ quote: string }>(sql + "");
        assert.equal(rows[0].quote, exp4);
    });

    after(async () => {
        await client.end();
    });
});
