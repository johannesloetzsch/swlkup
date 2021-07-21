{ pkgs ? import <nixpkgs> {} }:
(pkgs.writeScriptBin "frontendUpdatedDeps" ''
  #!${pkgs.runtimeShell} -e

  export PATH="${pkgs.lib.makeBinPath (with pkgs;[ nodejs nodePackages.node2nix ])}:$PATH"

  cd nix/deps
  node2nix -i ../../package.json -l ../../package-lock.json --development --strip-optional-dependencies
'')
