{pkgs ? import <nixpkgs> {},
 nodejs ? pkgs.nodejs-12_x,
 stdenv ? pkgs.stdenv,
 lib ? pkgs.lib,
 ...}:

let
  nodeDependencies = (pkgs.callPackage ./deps/default.nix {}).shell.nodeDependencies;

  deps = [ nodejs ] ++ (with pkgs; [ which coreutils ]);

  swlkupFrontend = stdenv.mkDerivation {
    name = "swlkup-frontend";
    src = lib.cleanSource ./..;
    buildInputs = deps;
    buildPhase = ''
      export PATH="${nodeDependencies}/bin:$PATH"
      ln -s ${nodeDependencies}/lib/node_modules ./node_modules

      npm run build
      npm run export
    '';
    installPhase = ''
      echo $out
      mkdir $out
      cp -r out $out/www
      cp serve.js $out
    '';
  };
in
lib.mergeAttrs
  (pkgs.writeScriptBin "swlkup-frontend" ''
    #!${pkgs.runtimeShell} -e

    export PATH="${nodeDependencies}/bin:${lib.makeBinPath deps}:$PATH"
    export NODE_PATH=${nodeDependencies}/lib/node_modules

    node ${swlkupFrontend}/serve.js ${swlkupFrontend}/www
    ''
  )
  { inherit swlkupFrontend; }
