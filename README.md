# sql-statement

Tiny SQL Statement Builder [![npm version](https://badge.fury.io/js/sql-statement.svg)](http://badge.fury.io/js/sql-statement) [![Build Status](https://travis-ci.org/kawanet/sql-statement.svg?branch=master)](https://travis-ci.org/kawanet/sql-statement)

### Usage

```js
var SQL = require("sql-statement");

var tableName = "users";
var id = "AC3C21E7";
var sql = new SQL();
sql.append("SELECT * FROM ?? WHERE id = ?", tableName, id);
console.log(sql + ""); // => "SELECT * FROM `users` WHERE id = 'AC3C21E7'"
```

See [documentation](http://kawanet.github.io/sql-statement/SQL.html) for more detail.

See [source](https://github.com/kawanet/sql-statement) at GitHub. PR welcomed.

### This DOES

- This does build a SQL statement in safe. That's it.

### This DOES NOT

- This is NOT an O/R mapper, nor ActiveSomething stuff.
- This does NOT connect database server, nor execute the SQL statement.
- This does NOT have a complex series of methods such like: select(), insert(), update(), remove(), etc.

### Installation

```sh
npm install --save sql-statement
```

## Examples

This module is tested with SQLite, MySQL and PostgreSQL.

### With [SQLite](https://www.npmjs.com/package/sqlite3)

```js
var sqlite3 = require("sqlite3");
var SQL = require("sql-statement");

var db = new sqlite3.Database(":memory:");
var sql = new SQL("SELECT * FROM users WHERE id = ?", id);

db.all(sql+"", function(err, rows) {
  if (err) return console.warn(err);
  // do something
});
```

### With [MySQL](https://www.npmjs.com/package/mysql)

```js
var mysql = require("mysql");
var SQL = require("sql-statement").mysql; // MySQL version

var conn = mysql.createConnection("mysql://user:pass@host/db");
var sql = new SQL("SELECT * FROM users WHERE id = ?", id);

conn.query(sql+"", function(err, result) {
  if (err) return console.warn(err);
  var rows = result.rows;
  // do something
});
```

### With [PostgreSQL](https://www.npmjs.com/package/pg)

```js
var pg = require("pg");
var SQL = require("sql-statement").Pg; // PostgreSQL version

var client = new pg.Client("postgres://user:pass@host/db");
var sql = new SQL("SELECT * FROM users WHERE id = ?", id);

client.query(sql+"", function(err, rows) {
  if (err) return console.warn(err);
  // do something
});
```

## License

The MIT License (MIT)

Copyright (c) 2013-2015 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
