The `Supervisor Lookup Frontend` is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

All pages can be statically rendered. For a production build run:

```bash
npm run build && npm run export && npm run serve
```

Assuming you also started the backend, you should be able to use [http://localhost:3000](http://localhost:3000).

## Deployment

You should configure the Webserver to rewrite `/token/*` to `out/token/\[token\].html`.
If you don't, access is only possible from other pages using `next/router`.

## Development

```bash
npm run dev
```
