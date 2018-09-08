#!/usr/bin/env mocha -R spec

var assert = require("assert");

var TESTNAME = __filename.split("/").pop();
var SQL = require("../sql");

describe(TESTNAME + " testing", function() {
  it("appendList()", function() {
    var array = ["aa", "bb", "cc"];

    assert.equal(SQL().appendList("?", array) + "", "'aa', 'bb', 'cc'");

    assert.equal(SQL().appendList("?", array, ",") + "", "'aa','bb','cc'");

    assert.equal(SQL().appendList("??", array, ",") + "", "`aa`,`bb`,`cc`");
  });
});
