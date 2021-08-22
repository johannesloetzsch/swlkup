{ pkgs ? import <nixpkgs> {},
  buildMavenRepositoryFromLockFile ? (import (fetchTarball "https://github.com/johannesloetzsch/mvn2nix/archive/master.tar.gz") {}).buildMavenRepositoryFromLockFile,
  patchPublic ? null
}:
let
  inherit (pkgs) lib stdenv jdk11_headless maven makeWrapper leiningen;
  inherit (stdenv) mkDerivation;

  mavenRepository = buildMavenRepositoryFromLockFile { file = ./deps/mvn2nix-lock.json; };

  src = stdenv.mkDerivation {
    name = "swlkup-backend-src";
    src = lib.cleanSource ./..;
    installPhase = ''
      cp -r . $out
    '';
  };

  version = "0.2.0";
  pname = "swlkup-backend";
  name = "${pname}-${version}";

  swlkup-backend-jar = mkDerivation rec {
    inherit src version pname name;
  
    buildInputs = [ jdk11_headless maven leiningen ];
    patchPhase = if isNull patchPublic
                 then ""
                 else "cp -r ${patchPublic}/* resources/public/";
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
      mkdir $out
      cp target/${name}-standalone.jar $out/
    '';
  };
in
lib.mergeAttrs
  (pkgs.writeScriptBin "${pname}" ''
    #!${pkgs.runtimeShell}

    ${jdk11_headless}/bin/java -jar ${swlkup-backend-jar}/${name}-standalone.jar $@ &

    ## We write a pid-file, so the integration test knows how to kill the server
    echo $! > .pid
  '')
  { inherit mavenRepository; jar = swlkup-backend-jar; }
