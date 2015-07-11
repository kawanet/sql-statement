#!/usr/bin/env mocha -R spec

var assert = require("assert");
var sqlite3 = require("sqlite3");
var promisen = require("promisen");

var TESTNAME = __filename.replace(/^.*\//, "");
var SQL = require("../sql");

describe(TESTNAME + " testing", function() {
  var sql1 = new SQL("SELECT ? AS ??", "BAR", "bar");
  it(sql1.query(), function(done) {
    var db = new sqlite3.Database(":memory:");
    db.get(sql1 + "", function(err, row) {
      assert.equal(typeof row, "object");
      assert.equal(row.bar, "BAR");
      done(err);
    });
  });

  var sql2 = new SQL("SELECT ? AS `foo`", "FOO");
  it("promisen.denodeify(db.get).apply(db, sql)", function(done) {
    var db = new sqlite3.Database(":memory:");
    promisen.denodeify(db.get).apply(db, sql2).then(wrap(done, function(row) {
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
