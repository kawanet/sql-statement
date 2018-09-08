#!/usr/bin/env mocha -R spec

var assert = require("assert");

var TESTNAME = __filename.split("/").pop();
var SQL = require("../sql");

describe(TESTNAME + " testing", function() {

  it("appendPairs()", function() {
    var object = {aa: "AA", bb: "BB"};

    assert.equal(SQL().appendPairs("?? = ?", object) + "", "`aa` = 'AA', `bb` = 'BB'");

    assert.equal(SQL().appendPairs("??=?", object) + "", "`aa`='AA', `bb`='BB'");

    assert.equal(SQL().appendPairs("??=?", object, ",") + "", "`aa`='AA',`bb`='BB'");
  });
});
