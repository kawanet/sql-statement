#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";

// import SQL = require( "../");
import * as SQL from "../";

const TESTNAME = __filename.split("/").pop();

const SQ = "'";
const DQ = '"';
const AC = "`";
const BS = "\\";

describe(TESTNAME + " testing", () => {
    it(SQ, () => {
        assert.equal(new SQL("?", SQ) + "", SQ + SQ + SQ + SQ);
        assert.equal(new SQL("?", SQ + SQ) + "", SQ + SQ + SQ + SQ + SQ + SQ);
        assert.equal(new SQL("??", SQ) + "", AC + SQ + AC);
        assert.equal(new SQL("??", SQ + SQ) + "", AC + SQ + SQ + AC);
        assert.equal(new SQL.Pg("??", SQ) + "", DQ + SQ + DQ);
        assert.equal(new SQL.Pg("??", SQ + SQ) + "", DQ + SQ + SQ + DQ);
    });

    it(DQ, () => {
        assert.equal(new SQL("?", DQ) + "", SQ + DQ + SQ);
        assert.equal(new SQL("?", DQ + DQ) + "", SQ + DQ + DQ + SQ);
        assert.equal(new SQL("??", DQ) + "", AC + DQ + AC);
        assert.equal(new SQL("??", DQ + DQ) + "", AC + DQ + DQ + AC);
        assert.equal(new SQL.Pg("??", DQ) + "", DQ + DQ + DQ + DQ);
        assert.equal(new SQL.Pg("??", DQ + DQ) + "", DQ + DQ + DQ + DQ + DQ + DQ);
    });

    it(BS, function () {
        assert.equal(new SQL("?", BS) + "", SQ + BS + SQ);
        assert.equal(new SQL("?", BS + BS) + "", SQ + BS + BS + SQ);
        assert.equal(new SQL.mysql("?", BS) + "", SQ + BS + BS + SQ);
        assert.equal(new SQL.mysql("?", BS + BS) + "", SQ + BS + BS + BS + BS + SQ);
    });
});
