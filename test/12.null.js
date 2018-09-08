#!/usr/bin/env mocha -R spec

var assert = require("assert");

var TESTNAME = __filename.split("/").pop();
var SQL = require("../sql");

var NULL = null;
var UNDEF = void 0;

describe(TESTNAME + " testing", function() {
  it("null", function() {
    assert.equal(SQL("?", NULL) + "", 'NULL');
  });

  it("undefined", function() {
    assert.equal(SQL("?", UNDEF) + "", 'NULL');
  });
});
