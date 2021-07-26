{pkgs ? import <nixpkgs> {},
 nodejs ? pkgs.nodejs-12_x,
 stdenv ? pkgs.stdenv,
 lib ? pkgs.lib,
 ...}:

let
  src = stdenv.mkDerivation {
    name = "swlkup-frontend-src";
    src = lib.cleanSource ./..;
    installPhase = ''
      cp -r . $out
    '';
  };

  nodeDependencies = (pkgs.callPackage ./deps/default.nix {}).shell.nodeDependencies;

  deps = [ nodejs ] ++ (with pkgs; [ which coreutils ]);

  staticHTML = stdenv.mkDerivation {
    name = "swlkup-frontend-staticHTML";
    inherit src;
    buildInputs = deps;
    buildPhase = ''
      export PATH="${nodeDependencies}/bin:$PATH"
      ln -s ${nodeDependencies}/lib/node_modules ./node_modules

      npm run build
      npm run export
    '';
    installPhase = ''
      cp -r out $out
    '';
  };

  minimalServer = stdenv.mkDerivation {
    name = "swlkup-frontend-minimalServer";
    inherit src;
    installPhase = ''
      mkdir $out
      cp serve.js $out
    '';
  };
in
lib.mergeAttrs
  (pkgs.writeScriptBin "swlkup-frontend" ''
    #!${pkgs.runtimeShell} -e

    ## Note: we could strip the following dependencies further down, since only runtime deps of minimalServer are required.
    export PATH="${nodeDependencies}/bin:${lib.makeBinPath deps}:$PATH"
    export NODE_PATH=${nodeDependencies}/lib/node_modules

    node ${minimalServer}/serve.js ${staticHTML}
    ''
  )
  { inherit staticHTML nodeDependencies; }
