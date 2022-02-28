This can be used for debugging or to test with a dump of the productive database before releasing a new software version:

```sh
curl 'http://localhost:4000/graphql' -H 'Content-Type: application/json' --data '{"query": "query Export{ export(password: \"ADMIN_PASSPHRASE\"){out} }"}' | jq '.data.export.out' -r > /tmp/export.gpg
```

```sh
cd backend
gpg --decrypt /tmp/export.gpg | DB_SEED=/dev/stdin INMEMORY=true lein run
```
