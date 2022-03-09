{ pkgs ? import <nixpkgs> {},
  buildMavenRepositoryFromLockFile ? (import (fetchTarball "https://github.com/johannesloetzsch/mvn2nix/archive/master.tar.gz") {}).buildMavenRepositoryFromLockFile,
  patchPublic ? null
}:
let
  inherit (pkgs) lib stdenv jdk11_headless maven makeWrapper leiningen;
  inherit (stdenv) mkDerivation;

  mavenRepository = buildMavenRepositoryFromLockFile { file = ./deps/mvn2nix-lock.json; };

  src = mkDerivation {
    name = "swlkup-backend-src";
    src = lib.cleanSource ./..;
    installPhase = ''
      cp -r . $out
    '';
  };

  version = "0.3.3";
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

    ${pkgs.which}/bin/which mail || export PATH=./backend/resources/mock:$PATH

    ## TODO: JAVA_TOOL_OPTIONS should be generated from jvm-opts in project.clj and also update swlkup.service
    export MALLOC_ARENA_MAX=2
    export JAVA_TOOL_OPTIONS='-Dclojure.tools.logging.factory=clojure.tools.logging.impl/slf4j-factory -Dorg.slf4j.simpleLogger.defaultLogLevel=warn -Dlog4j2.formatMsgNoLookups=true'
    ${jdk11_headless}/bin/java -jar ${swlkup-backend-jar}/${name}-standalone.jar $@ &

    ## We write a pid-file, so the integration test knows how to kill the server
    echo $! > .pid
  '')
  { inherit mavenRepository; jar = swlkup-backend-jar; }
