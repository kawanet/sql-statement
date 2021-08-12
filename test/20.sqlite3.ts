#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {promisify} from "util";
import * as sqlite3 from "sqlite3";

// import SQL = require( "../");
import * as SQL from "../";

const TESTNAME = __filename.split("/").pop();

describe(TESTNAME + " testing", () => {
    let db: sqlite3.Database;

    before(async () => {
        db = new sqlite3.Database(":memory:");
    });

    const sql1 = new SQL("SELECT ? AS ??", "BAR", "bar");
    it(sql1.query(), async () => {
        const rows: { bar: string }[] = await promisify(db.all).call(db, sql1 + "");
        assert.equal(typeof rows, "object");
        const row = rows[0];
        assert.equal(typeof row, "object");
        assert.equal(row.bar, "BAR");
    });

    const sql2 = new SQL("SELECT ? AS ??", "FOO", "foo");
    it(sql2.query(), async () => {
        const rows: { foo: string }[] = await promisify(db.all).call(db, sql2 + "");
        assert.equal(typeof rows, "object");
        const row = rows[0];
        assert.equal(typeof row, "object");
        assert.equal(row.foo, "FOO");
    });

    // sqlite3 library does NOT support ??, double question marks
    const sql3 = new SQL("SELECT ? AS `baz`", "BAZ");
    it(sql3.query(), async () => {
        const rows: { baz: string }[] = await promisify(db.all).apply(db, sql3);
        assert.equal(typeof rows, "object");
        const row = rows[0];
        assert.equal(typeof row, "object");
        assert.equal(row.baz, "BAZ");
    });

    const sql4 = "SELECT ? AS `quote`";
    const exp4 = "\"\'\\\"\'\\";
    it("new SQL(" + JSON.stringify(sql4) + ", " + JSON.stringify(exp4) + ")", async () => {
        const sql = new SQL(sql4, exp4);
        const rows: { quote: string }[] = await promisify(db.all).call(db, sql + "");
        assert.equal(rows[0].quote, exp4);
    });

    after(async () => {
        // await promisify(db.close)();
    });
});
