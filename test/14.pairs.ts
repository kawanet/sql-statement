#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

// import SQL = require( "../");
import * as SQL from "../";

const TESTNAME = __filename.split("/").pop();

describe(TESTNAME + " testing", () => {
    it("appendPairs()", () => {
        const object = {aa: "AA", bb: "BB"};

        assert.equal(new SQL().appendPairs("?? = ?", object) + "", "`aa` = 'AA', `bb` = 'BB'");

        assert.equal(new SQL().appendPairs("??=?", object) + "", "`aa`='AA', `bb`='BB'");

        assert.equal(new SQL().appendPairs("??=?", object, ",") + "", "`aa`='AA',`bb`='BB'");
    });
});
