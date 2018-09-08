/*! sql.js */

module.exports = SQL;

var map = Array.prototype.map;
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
  if (!(sql instanceof SQL)) sql = new SQL();
  if (!sql.length) push.call(sql, "", []);
  if (arguments.length) sql.append.apply(sql, arguments);
  return sql;
}

/**
 * This defines quote character for placeholder "?", single question mark.
 *
 * @name SQL.prototype.?
 * @type {string}
 * @default <code>'</code>, "0x27"
 */

SQL.prototype["?"] = "'";

/**
 * This defines quote character for placeholder "??", double question marks.
 * Default is <code>`</code> which works with MySQL and SQLite.
 * Set <code>"</code>, double quote, to work with PostgreSQL.
 *
 * @name SQL.prototype.??
 * @type {string}
 * @default <code>`</code>, "0x60"
 */

SQL.prototype["??"] = "`";

/**
 * This defines quote character for placeholder "???", triple question marks.
 *
 * @name SQL.prototype.???
 * @type {string}
 * @default undefined (which means no escaping applied)
 */

SQL.prototype["???"] = void 0;

/**
 * This defines value for null and undefined.
 *
 * @name SQL.prototype.null
 * @type {string}
 * @default "NULL"
 */

SQL.prototype["null"] = "NULL";

/**
 * @internal
 */

SQL.prototype._backslash = void 0;

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

var prepend = SQL.prototype.prepend = function(query, binding) {
  var bindings = slice.call(arguments, 1);
  if (query instanceof SQL) {
    prepend.apply(this, query);
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

var append = SQL.prototype.append = function(query, binding) {
  var bindings = slice.call(arguments, 1);
  if (query instanceof SQL) {
    append.apply(this, query);
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
 * This appends values of the list.
 *
 * @example
 * var sql = new SQL("SELECT * FROM table WHERE id IN (");
 * sql.appendList(array);
 * sql.append(")");
 *
 * @param placeholder {string} typically: "?"
 * @param array {string[]} value list
 * @param [separator] {string} default: ", "
 * @returns {SQL} SQL object itself for method chaining
 */

SQL.prototype.appendList = function(placeholder, array, separator) {
  var query = map.call(array, function() {
    return placeholder || "?";
  }).join(separator || ", ");

  var args = [query].concat(array);

  return append.apply(this, args);
};

/**
 * This appends key/value pairs of the object.
 *
 * @example
 * var sql = new SQL("UPDATE table SET");
 * sql.appendPairs(object);
 *
 * @example
 * var sql = new SQL("SELECT * FROM table WHERE");
 * sql.appendPairs(object, "?? = ?", " AND ");
 *
 * @param placeholder {string} typically: "?? = ?"
 * @param object {Object} key/value object
 * @param [separator] {string} default: ", "
 * @returns {SQL} SQL object itself for method chaining
 */

SQL.prototype.appendPairs = function(placeholder, object, separator) {
  var args = [];

  var query = map.call(Object.keys(object), function(key) {
    args.push(key, object[key]);
    return placeholder || "?? = ?";
  }).join(separator || ", ");

  args.unshift(query);

  return append.apply(this, args);
};

/**
 * This returns the string of SQL statement which placeholders are fulfilled with values bound.
 *
 * @returns {string} SQL statement formatted
 */

SQL.prototype.toString = function() {
  var sql = this;
  var query = this[0];
  var bindings = this[1];
  var idx = 0;
  var cache = {};
  var NULL = sql["null"];
  return query.replace(/(\?\??\??)/g, repl);

  function repl(str) {
    var val = bindings[idx++];

    if (NULL && val == null) return NULL;

    if ("string" !== typeof val) val += "";
    if (sql._backslash) {
      val = val.replace(sql._backslash, "\\$1");
    }
    var quote = sql[str];
    if (quote == null) return val; // raw
    var re = cache[quote] || (cache[quote] = new RegExp(quote, "g"));
    return quote + val.replace(re, quote + quote) + quote;
  }
};

SQL.Pg = Pg;

function Pg() {
  var sql = this;
  if (!(sql instanceof Pg)) sql = new Pg();
  SQL.apply(sql, arguments);
  return sql;
}

Pg.prototype = inherit(SQL.prototype);

Pg.prototype["??"] = '"';

SQL.mysql = mysql;

function mysql() {
  var sql = this;
  if (!(sql instanceof mysql)) sql = new mysql();
  SQL.apply(sql, arguments);
  return sql;
}

mysql.prototype = inherit(SQL.prototype);

mysql.prototype._backslash = new RegExp("(\\\\)", "g");

function inherit(src) {
  F.prototype = src;
  return new F();

  function F() {
  }
}
