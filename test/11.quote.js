#!/usr/bin/env mocha -R spec

var assert = require("assert");

var TESTNAME = __filename.replace(/^.*\//, "");
var SQL = require("../sql");

var SQ = "'";
var DQ = '"';
var AC = "`";
var BS = "\\";

describe(TESTNAME + " testing", function() {
  it(SQ, function() {
    assert.equal(SQL("?", SQ) + "", SQ + SQ + SQ + SQ);
    assert.equal(SQL("?", SQ + SQ) + "", SQ + SQ + SQ + SQ + SQ + SQ);
    assert.equal(SQL("??", SQ) + "", AC + SQ + AC);
    assert.equal(SQL("??", SQ + SQ) + "", AC + SQ + SQ + AC);
    assert.equal(SQL.Pg("??", SQ) + "", DQ + SQ + DQ);
    assert.equal(SQL.Pg("??", SQ + SQ) + "", DQ + SQ + SQ + DQ);
  });

  it(DQ, function() {
    assert.equal(SQL("?", DQ) + "", SQ + DQ + SQ);
    assert.equal(SQL("?", DQ + DQ) + "", SQ + DQ + DQ + SQ);
    assert.equal(SQL("??", DQ) + "", AC + DQ + AC);
    assert.equal(SQL("??", DQ + DQ) + "", AC + DQ + DQ + AC);
    assert.equal(SQL.Pg("??", DQ) + "", DQ + DQ + DQ + DQ);
    assert.equal(SQL.Pg("??", DQ + DQ) + "", DQ + DQ + DQ + DQ + DQ + DQ);
  });

  it(BS, function() {
    assert.equal(SQL("?", BS) + "", SQ + BS + SQ);
    assert.equal(SQL("?", BS + BS) + "", SQ + BS + BS + SQ);
    assert.equal(SQL.mysql("?", BS) + "", SQ + BS + BS + SQ);
    assert.equal(SQL.mysql("?", BS + BS) + "", SQ + BS + BS + BS + BS + SQ);
  });
});
