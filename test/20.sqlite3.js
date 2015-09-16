#!/usr/bin/env mocha -R spec

var assert = require("assert");
var sqlite3 = require("sqlite3");
var promisen = require("promisen");

var TESTNAME = __filename.replace(/^.*\//, "");
var SQL = require("../sql");

describe(TESTNAME + " testing", function() {
  var sql1 = new SQL("SELECT ? AS ??", "BAR", "bar");
  it(sql1.query() + " -> db.all(sql+'', callback)", function(done) {
    var db = new sqlite3.Database(":memory:");
    db.all(sql1 + "", function(err, rows) {
      assert.equal(typeof rows, "object");
      var row = rows[0];
      assert.equal(typeof row, "object");
      assert.equal(row.bar, "BAR");
      done(err);
    });
  });

  var sql2 = new SQL("SELECT ? AS ??", "FOO", "foo");
  it(sql2.query() + " -> promisen.denodeify(db.all).call(db, sql+'').then()", function(done) {
    var db = new sqlite3.Database(":memory:");
    promisen.denodeify(db.all).call(db, sql2 + "").then(wrap(done, function(rows) {
      assert.equal(typeof rows, "object");
      var row = rows[0];
      assert.equal(typeof row, "object");
      assert.equal(row.foo, "FOO");
    })).catch(done);
  });

  // sqlite3 library does NOT support ??, double question marks
  var sql3 = new SQL("SELECT ? AS `baz`", "BAZ");
  it(sql3.query() + " -> promisen.denodeify(db.all).apply(db, sql).then()", function(done) {
    var db = new sqlite3.Database(":memory:");
    promisen.denodeify(db.all).apply(db, sql3).then(wrap(done, function(rows) {
      assert.equal(typeof rows, "object");
      var row = rows[0];
      assert.equal(typeof row, "object");
      assert.equal(row.baz, "BAZ");
    })).catch(done);
  });

  var sql4 = "SELECT ? AS `quote`";
  var exp4 = "\"\'\\\"\'\\";
  it("SQL(" + JSON.stringify(sql4) + ", " + JSON.stringify(exp4) + ")", function(done) {
    var db = new sqlite3.Database(":memory:");
    var sql = SQL(sql4, exp4);
    promisen.denodeify(db.all).call(db, sql + "").then(wrap(done, function(rows) {
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
