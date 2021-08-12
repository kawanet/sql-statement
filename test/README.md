## How to run tests with Docker

Use `Docker` to test with MySQL and PostgreSQL instances.

```sh
docker-compose build
docker-compose up -d
docker-compose logs -f node

docker-compose exec postgres psql -U postgres -d test

docker-compose exec mysql mysql --user=test --password=test test

docker-compose run node bash

docker-compose stop
```
