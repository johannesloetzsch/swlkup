# swlkup server

The core of the server is an graphql-api based on [specialist](https://github.com/ajk/specialist-server).

## Running

To start the server and send queries, run:

```bash
lein ring server

curl -H 'Content-type: application/json' -d '{"query":"{ lookup(token: \"T0p53cret\"){ ngo{name} supervisors {name_full} } }"}' http://localhost:4000/graphql
```

## Testing

```bash
lein test
```
