#!/usr/bin/env mocha -R spec

var assert = require("assert");
var mysql = require("mysql");
var promisen = require("promisen");

var TESTNAME = __filename.replace(/^.*\//, "");
var SQL = require("../sql").mysql;

var config = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
};

var go = !!config.host;
if (!go) describe = describe.skip;
var suffix = go ? " testing" : " skipped. To test this, please set MYSQL_HOST=127.0.0.1";

describe(TESTNAME + suffix, function() {
  var sql1 = new SQL("SELECT ? AS ??", "BAR", "bar");
  it(sql1.query() + " -> conn.query(sql+'', callback)", function(done) {
    var conn = mysql.createConnection(config);
    conn.query(sql1 + "", function(err, rows) {
      assert.equal(typeof rows, "object");
      var row = rows[0];
      assert.equal(typeof row, "object");
      assert.equal(row.bar, "BAR");
      done(err);
    });
  });

  var sql2 = new SQL("SELECT ? AS ??", "FOO", "foo");
  it(sql2.query() + " -> promisen.denodeify(conn.query).call(conn, sql+'').then()", function(done) {
    var conn = mysql.createConnection(config);
    promisen.denodeify(conn.query).call(conn, sql2 + "").then(wrap(done, function(rows) {
      assert.equal(typeof rows, "object");
      var row = rows[0];
      assert.equal(typeof row, "object");
      assert.equal(row.foo, "FOO");
    })).catch(done);
  });

  var sql3 = new SQL("SELECT ? AS ??", "BAZ", "baz");
  it(sql3.query() + " -> promisen.denodeify(conn.query).apply(conn, sql).then()", function(done) {
    var conn = mysql.createConnection(config);
    promisen.denodeify(conn.query).apply(conn, sql3).then(wrap(done, function(rows) {
      assert.equal(typeof rows, "object");
      var row = rows[0];
      assert.equal(typeof row, "object");
      assert.equal(row.baz, "BAZ");
    })).catch(done);
  });

  var sql4 = "SELECT ? AS `quote`";
  var exp4 = "\"\'\\\"\'\\";
  it("SQL(" + JSON.stringify(sql4) + ", " + JSON.stringify(exp4) + ")", function(done) {
    var conn = mysql.createConnection(config);
    var sql = SQL(sql4, exp4);
    promisen.denodeify(conn.query).call(conn, sql + "").then(wrap(done, function(rows) {
      assert.equal(rows[0].quote, exp4);
    })).catch(done);
  });
});

function wrap(done, test) {
  return function() {
    try {
      test.apply(this, arguments);
      done();
    } catch (e) {
      done(e);
    }
  };
}
