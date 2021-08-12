## How to run tests with Docker

Use `Docker` to test with MySQL and PostgreSQL instances.

```sh
docker-compose build
docker-compose up -d
docker-compose logs -f node
docker-compose run node bash
docker-compose stop
```
