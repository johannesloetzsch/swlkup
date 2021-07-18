{ pkgs ? import <nixpkgs> {},
  mvn2nix ? (import (fetchTarball "https://github.com/johannesloetzsch/mvn2nix/archive/master.tar.gz") {}).mvn2nix }:
pkgs.mkShell {
  buildInputs = with pkgs; [ leiningen mvn2nix ];

  shellHook = ''
    lein pom
    echo "Generating mvn2nix-lock.json, please wait…"
    mvn2nix --repositories https://clojars.org/repo https://repo.maven.apache.org/maven2 > nix/deps/mvn2nix-lock.json
    exit
  '';
}
