#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

// import SQL = require( "../");
import * as SQL from "../";

const TESTNAME = __filename.split("/").pop();

describe(TESTNAME + " testing", () => {
    it("appendList()", () => {
        const array = ["aa", "bb", "cc"];

        assert.equal(new SQL().appendList("?", array) + "", "'aa', 'bb', 'cc'");

        assert.equal(new SQL().appendList("?", array, ",") + "", "'aa','bb','cc'");

        assert.equal(new SQL().appendList("??", array, ",") + "", "`aa`,`bb`,`cc`");

        assert.equal(new SQL().appendList("?", [1, 2, 3]) + "", "1, 2, 3");

        assert.equal(new SQL().appendList("?", [null, undefined]) + "", "NULL, NULL");

        assert.equal(new SQL().appendList("?", [true, false]) + "", "true, false");
    });
});
