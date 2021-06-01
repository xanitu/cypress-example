# e2e Cypress

e2e for guillotina react

## Run tests

```
# Run postgres
docker run \
    -e POSTGRES_DB=guillotina \
    -e POSTGRES_USER=guillotina \
    -e POSTGRES_PASSWORD=guillotina \
    -p 127.0.0.1:5444:5432 \
    --name postgres_guillotina_cypress \
    postgres:9.6

# Run guillotina
docker run --rm -it -v $PWD/backend/:/backend/ \
    --link=postgres_guillotina_cypress -p 127.0.0.1:8080:8080 \
    plone/guillotina:latest \
    g -c /backend/g-conf.yaml
```
