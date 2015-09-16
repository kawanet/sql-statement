#!/usr/bin/env mocha -R spec

var assert = require("assert");
var pg = require("pg");
var promisen = require("promisen");

var TESTNAME = __filename.replace(/^.*\//, "");
var SQL = require("../sql").Pg;

var go = process.env.PGHOST || process.env.PGDATABASE;
if (!go) describe = describe.skip;
var suffix = go ? " testing" : " skipped. To test this, please set PGHOST=127.0.0.1 PGDATABASE=test";

describe(TESTNAME + suffix, function() {
  var sql1 = new SQL('SELECT ? AS ??', "FOO", "foo");
  it(sql1.query() + " -> client.query(sql+'', callback)", function(done) {
    var client = new pg.Client();
    client.connect(function(err) {
      if (err) return done(err);
      client.query(sql1 + "", function(err, result) {
        if (err) return done(err);
        var rows = result.rows;
        assert.equal(typeof rows, "object");
        var row = result.rows[0];
        assert.equal(typeof row, "object");
        assert.equal(row.foo, "FOO");
        done(err);
      });
    });
  });

  // pg library has completely difference style of placeholder

  var sql2 = new SQL('SELECT ? AS ??', "FOO", "foo");
  it(sql2.query() + " -> promisen.denodeify(client.query).call(client, sql+'').then()", function(done) {
    var client = new pg.Client();
    client.connect(function(err) {
      if (err) return done(err);
      promisen.denodeify(client.query).call(client, sql2 + "").then(wrap(done, function(result) {
        var rows = result.rows;
        assert.equal(typeof rows, "object");
        var row = rows[0];
        assert.equal(typeof row, "object");
        assert.equal(row.foo, "FOO");
      })).catch(done);
    });
  });

  // pg library has completely difference style of placeholder

  var sql3 = new SQL("SELECT $1::text AS \"baz\"", "BAZ");
  it(sql3.query() + " -> promisen.denodeify(client.query).apply(client, sql).then()", function(done) {
    var client = new pg.Client();
    client.connect(function(err) {
      if (err) return done(err);
      promisen.denodeify(client.query).apply(client, sql3).then(wrap(done, function(result) {
        var rows = result.rows;
        assert.equal(typeof rows, "object");
        var row = rows[0];
        assert.equal(typeof row, "object");
        assert.equal(row.baz, "BAZ");
      })).catch(done);
    });
  });

  var sql4 = 'SELECT ? AS "quote"';
  var exp4 = "\"\'\\\"\'\\";
  it("SQL(" + JSON.stringify(sql4) + ", " + JSON.stringify(exp4) + ")", function(done) {
    var client = new pg.Client();
    client.connect(function(err) {
      if (err) return done(err);
      var sql = SQL(sql4, exp4);
      promisen.denodeify(client.query).call(client, sql + "").then(wrap(done, function(result) {
        var rows = result.rows;
        assert.equal(rows[0].quote, exp4);
      })).catch(done);
    });
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
