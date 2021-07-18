{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  buildInputs = with pkgs; [ nodejs-14_x nodePackages.node2nix ];

  shellHook = ''
    cd nix/deps
    node2nix -i ../../package.json -l ../../package-lock.json --development --strip-optional-dependencies
    exit
  '';
}
