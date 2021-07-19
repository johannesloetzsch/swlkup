# swlkup server

The core of the server is an graphql-api based on [specialist](https://github.com/ajk/specialist-server).

## Running development server

To start the server and send queries, run:

```bash
lein run

curl -H 'Content-type: application/json' -d '{"query":"{ lookup(token: \"T0p53cret\"){ ngo{name} supervisors {name_full} } }"}' http://localhost:4000/graphql
```

## Testing

```bash
lein test
```

## Production build

```bash
lein ring uberjar

java -jar target/swlkup-*standalone.jar
```

### Reproducible builds

Whenever dependencies are changed, rebuild the mvn2nix-lock.json:

```bash
nix develop ..#backendUpdateDeps
```

This allows to build by:

```bash
nix build ..#backend
```
