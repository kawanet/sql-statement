#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

// import SQL = require( "../");
import * as SQL from "../";

const TESTNAME = __filename.split("/").pop();

const NULL: null = null;
const UNDEF: undefined = void 0;

describe(TESTNAME + " testing", () => {
    it("null", () => {
        assert.equal(new SQL("?", NULL) + "", 'NULL');
        assert.equal(new SQL().append("?", NULL) + "", 'NULL');
    });

    it("undefined", () => {
        assert.equal(new SQL("?", UNDEF) + "", 'NULL');
        assert.equal(new SQL().append("?", UNDEF) + "", 'NULL');
    });
});
