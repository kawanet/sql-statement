#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

// import SQL = require( "../");
import * as SQL from "../";

const TESTNAME = __filename.split("/").pop();

describe(TESTNAME + " testing", () => {
    it("new SQL()", () => {
        let sql = new SQL();
        assert.ok(sql);
        assert.ok(sql instanceof SQL);
        sql = new SQL("SELECT * FROM table WHERE ?? = ?", "id", "123");
        assert.equal(sql + "", "SELECT * FROM table WHERE `id` = '123'");
    });

    it("SQL()", () => {
        let sql = new SQL();
        assert.ok(sql);
        assert.ok(sql instanceof SQL);
        sql = new SQL("SELECT * FROM table WHERE ?? = ?", "id", "123");
        assert.equal(sql + "", "SELECT * FROM table WHERE `id` = '123'");
    });

    it("append()", () => {
        let sql = new SQL();
        sql = sql.append("SELECT * FROM table WHERE id = ?", 123);
        assert.ok(sql instanceof SQL);
        assert.equal(sql + "", "SELECT * FROM table WHERE id = 123");
        sql.append("AND ?? = 'f'", "deleted");
        assert.equal(sql + "", "SELECT * FROM table WHERE id = 123 AND `deleted` = 'f'");
        sql.append("ORDER BY created_at");
        assert.equal(sql + "", "SELECT * FROM table WHERE id = 123 AND `deleted` = 'f' ORDER BY created_at");
        sql.append(new SQL("LIMIT ?", 10));
        assert.equal(sql + "", "SELECT * FROM table WHERE id = 123 AND `deleted` = 'f' ORDER BY created_at LIMIT 10");
    });

    it("prepend()", () => {
        let sql = new SQL();
        sql = sql.prepend("LIMIT ?", 10);
        assert.ok(sql instanceof SQL);
        assert.equal(sql + "", "LIMIT 10");
        sql.prepend("ORDER BY created_at");
        assert.equal(sql + "", "ORDER BY created_at LIMIT 10");
        sql.prepend("?? = 'f'", "deleted");
        assert.equal(sql + "", "`deleted` = 'f' ORDER BY created_at LIMIT 10");
        sql.prepend(new SQL("SELECT * FROM table WHERE id = ? AND", 123));
        assert.equal(sql + "", "SELECT * FROM table WHERE id = 123 AND `deleted` = 'f' ORDER BY created_at LIMIT 10");
    });

    it("query()", () => {
        const sql = new SQL();
        assert.equal(typeof sql.query(), "string");
        sql.append("SELECT * FROM users WHERE id = ?", 123);
        assert.equal(sql.query(), "SELECT * FROM users WHERE id = ?");
    });

    it("bindings()", () => {
        const sql = new SQL("SELECT * FROM users WHERE id = ? AND deleted = ?", "123", "f");
        const bindings = sql.bindings();
        assert.ok(bindings instanceof Array);
        assert.equal(bindings.length, 2);
        assert.equal(bindings[0], "123");
        assert.equal(bindings[1], "f");
    });

    it("toString()", () => {
        const sql = new SQL("SELECT * FROM users WHERE id = ? AND ?? = 'f' AND grp_id IN (???)", "123", "deleted", "1, 2, 3");
        const str = sql.toString();
        assert.equal(typeof str, "string");
        assert.equal(str, "SELECT * FROM users WHERE id = '123' AND `deleted` = 'f' AND grp_id IN (1, 2, 3)");
        assert.equal(sql + "", str);
    });
});
