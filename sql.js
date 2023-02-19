/*! sql.js */

module.exports = SQL;

const map = Array.prototype.map;
const slice = Array.prototype.slice;
const push = Array.prototype.push;

/*jshint eqnull:true*/

/**
 * This is a tiny class to build SQL statement.
 *
 * @param [query] {string} SQL statement such like: "SELECT * FROM table WHERE id = ?"
 * @param [binding] {...string} value(s) to fulfill placeholder(s) of the statement
 * @constructor
 * @example
 * const SQL = require("sql-statement");
 *
 * const id = "123";
 * const sql = SQL("SELECT * FROM users WHERE id = ?", id);
 *
 * console.log("SQL: " + sql); // => SQL: SELECT * FROM users WHERE id = '123'
 *
 * const key = "group_id";
 * const grp = [45, 67, 89].join(", ");
 * sql.append("AND ?? IN (???)", key, grp);
 *
 * console.log("SQL: " + sql); // => SQL: SELECT * FROM users WHERE id = '123' AND `group_id` IN (45, 67, 89)
 */

function SQL(query, binding) {
  let sql = this;
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
 * @returns {string[]} values for placeholders
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

const prepend = SQL.prototype.prepend = function(query, binding) {
  let bindings = slice.call(arguments, 1);
  if (query instanceof SQL) {
    bindings = query[1];
    query = query[0];
  }
  if (query != null && query !== "") {
    const delim = (this[0] === "") ? "" : " ";
    this[0] = query + delim + this[0];
  }
  if (bindings.length) {
    this[1] = [].concat(bindings, this[1]);
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

const append = SQL.prototype.append = function(query, binding) {
  let bindings = slice.call(arguments, 1);
  if (query instanceof SQL) {
    bindings = query[1];
    query = query[0];
  }
  if (query != null && query !== "") {
    const delim = (this[0] === "") ? "" : " ";
    this[0] = this[0] + delim + query;
  }
  if (bindings.length) {
    this[1] = [].concat(this[1], bindings);
  }
  return this;
};

/**
 * This appends values of the list.
 *
 * @example
 * const sql = new SQL("SELECT * FROM table WHERE id IN (");
 * sql.appendList(array);
 * sql.append(")");
 *
 * @param placeholder {string} typically: "?"
 * @param array {string[]} value list
 * @param [separator] {string} default: ", "
 * @returns {SQL} SQL object itself for method chaining
 */

SQL.prototype.appendList = function(placeholder, array, separator) {
  const query = map.call(array, function() {
    return placeholder || "?";
  }).join(separator || ", ");

  const args = [query].concat(array);

  return append.apply(this, args);
};

/**
 * This appends key/value pairs of the object.
 *
 * @example
 * const sql = new SQL("UPDATE table SET");
 * sql.appendPairs(object);
 *
 * @example
 * const sql = new SQL("SELECT * FROM table WHERE");
 * sql.appendPairs(object, "?? = ?", " AND ");
 *
 * @param placeholder {string} typically: "?? = ?"
 * @param object {Object} key/value object
 * @param [separator] {string} default: ", "
 * @returns {SQL} SQL object itself for method chaining
 */

SQL.prototype.appendPairs = function(placeholder, object, separator) {
  const args = [];

  const query = map.call(Object.keys(object), function(key) {
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
  const sql = this;
  const query = this[0];
  let bindings = this[1];
  let idx = 0;
  const cache = {};
  const NULL = sql["null"];
  return query.replace(/(\?\??\??)/g, repl);

  function repl(str) {
    let val = bindings[idx++];

    if (NULL && val == null) return NULL;

    if ("boolean" === typeof val) return val;

    // allow numbers
    if ("number" === typeof val && isFinite(val)) return val;

    if ("string" !== typeof val) val += "";
    if (sql._backslash) {
      val = val.replace(sql._backslash, "\\$1");
    }
    const quote = sql[str];
    if (quote == null) return val; // raw
    const re = cache[quote] || (cache[quote] = new RegExp(quote, "g"));
    return quote + val.replace(re, quote + quote) + quote;
  }
};

SQL.Pg = Pg;

function Pg() {
  let sql = this;
  if (!(sql instanceof Pg)) sql = new Pg();
  SQL.apply(sql, arguments);
  return sql;
}

Pg.prototype = inherit(SQL.prototype);

Pg.prototype["??"] = '"';

SQL.mysql = mysql;

function mysql() {
  let sql = this;
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
