#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

// import SQL = require( "../");
import * as SQL from "../";

const TESTNAME = __filename.split("/").pop();

describe(TESTNAME + " testing", () => {
    it("boolean", () => {
        assert.equal(new SQL("?", true) + "", 'true');
        assert.equal(new SQL("?", false) + "", 'false');

        assert.equal(new SQL.Pg("?", true) + "", 'true');
        assert.equal(new SQL.Pg("?", false) + "", 'false');

        assert.equal(new SQL.mysql("?", true) + "", 'true');
        assert.equal(new SQL.mysql("?", false) + "", 'false');
    });
});
