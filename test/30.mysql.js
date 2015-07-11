#!/usr/bin/env mocha -R spec

var assert = require("assert");
var mysql = require("mysql");
var promisen = require("promisen");

var TESTNAME = __filename.replace(/^.*\//, "");
var SQL = require("../sql");

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
  it(sql1.query(), function(done) {
    var connection = mysql.createConnection(config);
    connection.query(sql1 + "", function(err, rows) {
      assert.equal(typeof rows, "object");
      var row = rows[0];
      assert.equal(typeof row, "object");
      assert.equal(row.bar, "BAR");
      done(err);
    });
  });

  var sql2 = new SQL("SELECT ? AS `foo`", "FOO");
  it("promisen.denodeify(connection.query).apply(connection, sql)", function(done) {
    var connection = mysql.createConnection(config);
    promisen.denodeify(connection.query).apply(connection, sql2).then(wrap(done, function(rows) {
      assert.equal(typeof rows, "object");
      var row = rows[0];
      assert.equal(typeof row, "object");
      assert.equal(row.foo, "FOO");
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
