# sql-statement [![Build Status](https://travis-ci.org/kawanet/sql-statement.svg?branch=master)](https://travis-ci.org/kawanet/sql-statement)

Tiny SQL Statement Builder

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

### Repository

- https://github.com/kawanet/sql-statement

### License

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
