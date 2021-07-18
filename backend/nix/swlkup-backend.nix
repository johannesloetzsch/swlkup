{ pkgs ? import <nixpkgs> {},
  buildMavenRepositoryFromLockFile ? (import (fetchTarball "https://github.com/johannesloetzsch/mvn2nix/archive/master.tar.gz") {}).buildMavenRepositoryFromLockFile
}:
let
  mavenRepository = buildMavenRepositoryFromLockFile { file = ./deps/mvn2nix-lock.json; };
inherit (pkgs) lib stdenv jdk11_headless maven makeWrapper leiningen;
inherit (stdenv) mkDerivation;
in mkDerivation rec {
  pname = "swlkup-backend";
  version = "0.1.0-SNAPSHOT";
  name = "${pname}-${version}";
  src = lib.cleanSource ./..;

  buildInputs = [ jdk11_headless maven makeWrapper leiningen ];
  buildPhase = ''
    echo "Building with maven repository ${mavenRepository}"
    export HOME=`pwd`
    mkdir .lein
    echo '{:user {:offline? true :local-repo "${mavenRepository}"}}' > ~/.lein/profiles.clj
    lein uberjar
  '';

  doCheck = true;
  checkPhase = ''
    lein test
  '';

  installPhase = ''
    mkdir -p $out/bin
    ln -s ${mavenRepository} $out/lib
    cp target/${name}-standalone.jar $out/
    makeWrapper ${jdk11_headless}/bin/java $out/bin/${pname} --add-flags "-jar $out/${name}-standalone.jar"
  '';
}
