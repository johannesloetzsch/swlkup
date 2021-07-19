Swlkup is an application to manage a database of supervisors and provide anonymous access for authorized users.

## Start

The easiest way to start a reproducible build of the fullstack application, is calling the [`nix Flake`](https://nixos.wiki/wiki/Flakes) from the toplevel directory:

```bash
nix run
```

If you don't have `nix`, you can run it in a docker container:

```bash
docker build -t swlkup . && docker run -ti -v nix:/nix/ -p 4000:4000 swlkup
```

Alternatively you can start the backend and frontend separately as described in the according directories.
