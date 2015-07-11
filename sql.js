/*! sql.js */

module.exports = SQL;

var slice = Array.prototype.slice;
var push = Array.prototype.push;
var unshift = Array.prototype.unshift;

/*jshint eqnull:true*/

/**
 * This is a tiny class to build SQL statement.
 *
 * @param [query] {string} SQL statement such like: "SELECT * FROM table WHERE id = ?"
 * @param [binding] {...string} value(s) to fulfill placeholder(s) of the statement
 * @constructor
 * @example
 * var SQL = require("sql-statement");
 *
 * var id = "123";
 * var sql = SQL("SELECT * FROM users WHERE id = ?", id);
 *
 * console.log("SQL: " + sql); // => SQL: SELECT * FROM users WHERE id = '123'
 *
 * var key = "group_id";
 * var grp = [45, 67, 89].join(", ");
 * sql.append("AND ?? IN (???)", key, grp);
 *
 * console.log("SQL: " + sql); // => SQL: SELECT * FROM users WHERE id = '123' AND `group_id` IN (45, 67, 89)
 */

function SQL(query, binding) {
  var sql = this;
  if (sql instanceof SQL) {
    push.call(sql, "", []);
  } else {
    sql = new SQL();
  }
  if (arguments.length) sql.append.apply(sql, arguments);
  return sql;
}

/**
 * This returns the string of SQL statement unformatted.
 *
 * @returns {string} SQL statement unformatted
 */

SQL.prototype.query = function() {
  return this[0];
};

/**
 * This returns the array of values for placeholders.
 *
 * @returns {Array} values for placeholders
 */

SQL.prototype.bindings = function() {
  return this[1];
};

/**
 * This inserts a piece of SQL statement at the beginning.
 *
 * @param query {string|SQL} SQL statement piece such like: "WHERE id = ?"
 * @param [binding] {...string} value(s) to fulfill placeholder(s) of the statement
 * @returns {SQL} SQL object itself for method chaining
 */

SQL.prototype.prepend = function(query, binding) {
  var bindings = slice.call(arguments, 1);
  if (query instanceof SQL) {
    this.prepend.apply(this, query);
    query = "";
  }
  if (query != null && query !== "") {
    var delim = (this[0] === "") ? "" : " ";
    this[0] = query + delim + this[0];
  }
  if (bindings.length) {
    unshift.apply(this[1], bindings);
  }
  return this;
};

/**
 * This appends a piece of SQL statement at the end.
 *
 * @param query {string|SQL} SQL statement piece such like: "WHERE id = ?"
 * @param [binding] {...string} value(s) to fulfill placeholder(s) of the statement
 * @returns {SQL} SQL object itself for method chaining
 */

SQL.prototype.append = function(query, binding) {
  var bindings = slice.call(arguments, 1);
  if (query instanceof SQL) {
    this.append.apply(this, query);
    query = "";
  }
  if (query != null && query !== "") {
    var delim = (this[0] === "") ? "" : " ";
    this[0] = this[0] + delim + query;
  }
  if (bindings.length) {
    push.apply(this[1], bindings);
  }
  return this;
};

/**
 * This returns the string of SQL statement which placeholders are fulfilled with values bound.
 *
 * @returns {string} SQL statement formatted
 */

SQL.prototype.toString = function() {
  var sql = this[0];
  var bindings = this[1];
  var idx = 0;
  return sql.replace(/(\?\??\??)/g, repl);

  function repl(str) {
    var val = bindings[idx++] + "";
    if (str == "?") {
      val = val.replace(/'/g, "''");
      str = "'" + val + "'";
    } else if (str == "??") {
      val = val.replace(/`/g, "``"); // is this correct?
      str = "`" + val + "`";
    } else if (str == "???") {
      str = val; // raw
    }
    return str;
  }
};
