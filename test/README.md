## Testing

To test with MySQL and PostgreSQL, it needs the database running and some environment variables as below.

## Testing with MySQL

```sh
brew install mysql
mysqld &
export MYSQL_HOST=127.0.0.1
make test
killall mysqld
```

## Testing with PostgreSQL

```sh
brew install postgresql
initdb testdb
postgres -D testdb &
createdb testdb
export PGHOST=127.0.0.1
export PGDATABASE=testdb
make test
killall postgres
```
