# sql-statement

[![npm version](https://badge.fury.io/js/sql-statement.svg)](http://badge.fury.io/js/sql-statement)
[![Node.js CI](https://github.com/kawanet/sql-statement/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/kawanet/sql-statement/actions/)

Tiny SQL Statement Builder

### Usage

```js
const SQL = require("sql-statement").mysql;

const tableName = "users";
const id = "AC3C21E7";
const sql = new SQL();
sql.append("SELECT * FROM ?? WHERE id = ?", tableName, id);

console.log(String(sql)); // => "SELECT * FROM `users` WHERE id = 'AC3C21E7'"
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
const sqlite3 = require("sqlite3");
const SQL = require("sql-statement");

const db = new sqlite3.Database(":memory:");
const sql = new SQL("SELECT * FROM users WHERE id = ?", id);

db.all(String(sql), function(err, rows) {
  if (err) return console.warn(err);
  // do something
});
```

### With [MySQL](https://www.npmjs.com/package/mysql)

```js
const mysql = require("mysql");
const SQL = require("sql-statement").mysql; // MySQL version

const conn = mysql.createConnection("mysql://user:pass@host/db");
const sql = new SQL("SELECT * FROM users WHERE id = ?", id);

conn.query(String(sql), function(err, result) {
  if (err) return console.warn(err);
  const rows = result.rows;
  // do something
});
```

### With [PostgreSQL](https://www.npmjs.com/package/pg)

```js
const pg = require("pg");
const SQL = require("sql-statement").Pg; // PostgreSQL version

const client = new pg.Client("postgres://user:pass@host/db");
const sql = new SQL("SELECT * FROM users WHERE id = ?", id);

client.query(String(sql), function(err, rows) {
  if (err) return console.warn(err);
  // do something
});
```

## appendList and appendPairs

Since v0.2.0, This also provides helper methods: `appendList()` and `appendPairs()`.

```js
const keys = ["id", "name", "age"];
const values = [123, 456, 789];

const sql = new SQL("SELECT");
sql.appendList("??", keys);
sql.append("FROM table WHERE id IN (");
sql.appendList("?", values);
sql.append(")");

console.log(String(sql)); // => SELECT `id`, `name`, `age` FROM table WHERE id IN ( 123, 456, 789 )
```

```js
const object = {name: "Ken", age: 41};
const condition = {id: 123};

const sql = new SQL("UPDATE table SET");
sql.appendPairs("?? = ?", object);
sql.append("WHERE");
sql.appendPairs("?? = ?", condition, " AND ");

console.log(String(sql)); // => UPDATE table SET `name` = 'Ken', `age` = 41 WHERE `id` = 123
```

## TypeScript

for SQLite

```ts
import * as SQL from "sql-statement";
// OR
import SQL = require("sql-statement");
```

for MySQL

```ts
import {mysql as SQL} from "sql-statement";
```

for PostgreSQL

```ts
import {Pg as SQL} from "sql-statement";
```

## License

The MIT License (MIT)

Copyright (c) 2013-2023 Yusuke Kawasaki

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
