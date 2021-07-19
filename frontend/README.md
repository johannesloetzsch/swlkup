The `Supervisor Lookup Frontend` is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Development

```bash
npm run dev
```

Assuming you also started the backend, you should be able to access the frontend at [http://localhost:3000](http://localhost:3000).

### Codegen

We use typescript types automatically generated from the graphql-schema. Whenever the schema is changed in the backend, run:

```bash
npm run generate
or
```bash
nix develop ..#frontendCodegen
```

## Production build

All pages can be statically rendered:

```bash
npm run build && npm run export && npm run serve
```

### Deployment

You should configure the Webserver to rewrite `/token/*` to `out/token/\[token\].html`.
If you don't, access is only possible from other pages using `next/router`.
A trivial server doing this rewrite is implemented in `serve.js`.
The backend also supports serving the frontend.

### Reproducible builds

Whenever dependencies are changed, rebuild `default.nix`,  `node-env.nix` and  `node-packages.nix` in `./nix/deps/`:

```bash
nix develop ..#frontendUpdateDeps
```

This allows to build by:

```bash
nix build ..#frontend
```
