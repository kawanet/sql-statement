#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import {promisify} from "util";
import * as mysql from "mysql";

import {mysql as SQL} from "../";

const TESTNAME = __filename.split("/").pop();

const config: mysql.ConnectionConfig = {
    host: process.env.MYSQL_HOST,
    port: +(process.env.MYSQL_PORT as string) || undefined,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
};

const go = !!config.host;
const DESCRIBE = go ? describe : describe.skip;
const suffix = go ? " testing" : " skipped. To test this, please set MYSQL_HOST=127.0.0.1";

DESCRIBE(TESTNAME + suffix, function () {
    let conn: mysql.Connection;

    before(async () => {
        conn = mysql.createConnection(config);
    });

    const sql1 = new SQL("SELECT ? AS ??", "BAR", "bar");
    it(sql1.query(), async () => {
        const rows: { bar: string }[] = await promisify(conn.query).call(conn, sql1 + "");
        assert.equal(typeof rows, "object");
        const row = rows[0];
        assert.equal(typeof row, "object");
        assert.equal(row.bar, "BAR");
    });

    const sql2 = new SQL("SELECT ? AS ??", "FOO", "foo");
    it(sql2.query(), async () => {
        const rows: { foo: string }[] = await promisify(conn.query).apply(conn, sql2);
        assert.equal(typeof rows, "object");
        const row = rows[0];
        assert.equal(typeof row, "object");
        assert.equal(row.foo, "FOO");
    });

    //
    const sql3 = new SQL("SELECT ? AS ??", "BAZ", "baz");
    it(sql3.query(), async () => {
        const rows: { baz: string }[] = await promisify(conn.query).apply(conn, sql3);
        assert.equal(typeof rows, "object");
        const row = rows[0];
        assert.equal(typeof row, "object");
        assert.equal(row.baz, "BAZ");
    });

    const sql4 = "SELECT ? AS `quote`";
    const exp4 = "\"\'\\\"\'\\";
    it("new SQL(" + JSON.stringify(sql4) + ", " + JSON.stringify(exp4) + ")", async () => {
        const sql = new SQL(sql4, exp4);
        const rows: { quote: string }[] = await promisify(conn.query).call(conn, sql + "");
        assert.equal(rows[0].quote, exp4);
    });

    after(async () => {
        await conn.end();
    });
});
