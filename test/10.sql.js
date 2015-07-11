#!/usr/bin/env mocha -R spec

var assert = require("assert");

var TESTNAME = __filename.replace(/^.*\//, "");
var SQL = require("../sql");

describe(TESTNAME + " testing", function() {
  it("new SQL()", function() {
    var sql = new SQL();
    assert.ok(sql);
    assert.ok(sql instanceof SQL);
    sql = new SQL("SELECT * FROM table WHERE ?? = ?", "id", "123");
    assert.equal(sql + "", "SELECT * FROM table WHERE `id` = '123'");
  });

  it("SQL()", function() {
    var sql = SQL();
    assert.ok(sql);
    assert.ok(sql instanceof SQL);
    sql = SQL("SELECT * FROM table WHERE ?? = ?", "id", "123");
    assert.equal(sql + "", "SELECT * FROM table WHERE `id` = '123'");
  });

  it("append()", function() {
    var sql = new SQL();
    sql = sql.append("SELECT * FROM table WHERE id = ?", 123);
    assert.ok(sql instanceof SQL);
    assert.equal(sql + "", "SELECT * FROM table WHERE id = '123'");
    sql.append("AND ?? = 'f'", "deleted");
    assert.equal(sql + "", "SELECT * FROM table WHERE id = '123' AND `deleted` = 'f'");
    sql.append("ORDER BY created_at");
    assert.equal(sql + "", "SELECT * FROM table WHERE id = '123' AND `deleted` = 'f' ORDER BY created_at");
    sql.append(SQL("LIMIT ?", 10));
    assert.equal(sql + "", "SELECT * FROM table WHERE id = '123' AND `deleted` = 'f' ORDER BY created_at LIMIT '10'");
  });

  it("prepend()", function() {
    var sql = new SQL();
    sql = sql.prepend("LIMIT ?", 10);
    assert.ok(sql instanceof SQL);
    assert.equal(sql + "", "LIMIT '10'");
    sql.prepend("ORDER BY created_at");
    assert.equal(sql + "", "ORDER BY created_at LIMIT '10'");
    sql.prepend("?? = 'f'", "deleted");
    assert.equal(sql + "", "`deleted` = 'f' ORDER BY created_at LIMIT '10'");
    sql.prepend(SQL("SELECT * FROM table WHERE id = ? AND", 123));
    assert.equal(sql + "", "SELECT * FROM table WHERE id = '123' AND `deleted` = 'f' ORDER BY created_at LIMIT '10'");
  });

  it("query()", function() {
    var sql = SQL();
    assert.equal(typeof sql.query(), "string");
    sql.append("SELECT * FROM users WHERE id = ?", 123);
    assert.equal(sql.query(), "SELECT * FROM users WHERE id = ?");
  });

  it("bindings()", function() {
    var sql = SQL("SELECT * FROM users WHERE id = ? AND deleted = ?", "123", "f");
    var bindings = sql.bindings();
    assert.ok(bindings instanceof Array);
    assert.equal(bindings.length, 2);
    assert.equal(bindings[0], "123");
    assert.equal(bindings[1], "f");
  });

  it("toString()", function() {
    var sql = SQL("SELECT * FROM users WHERE id = ? AND ?? = 'f' AND grp_id IN (???)", "123", "deleted", "1, 2, 3");
    var str = sql.toString();
    assert.equal(typeof str, "string");
    assert.equal(str, "SELECT * FROM users WHERE id = '123' AND `deleted` = 'f' AND grp_id IN (1, 2, 3)");
    assert.equal(sql + "", str);
  });
});
