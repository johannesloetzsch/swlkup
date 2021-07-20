{ pkgs ? import <nixpkgs> { inherit system; },
  system ? builtins.currentSystem
}:
let
  nodePackages = import ./default.nix { inherit pkgs system; };

  cypressNpm = nodePackages."cypress-7.3.0".override {
    preRebuild = ''
      export CYPRESS_INSTALL_BINARY=0
    '';
  };
in
(pkgs.writeScriptBin "swlkup-frontend" ''
  #!${pkgs.runtimeShell} -e

  [ -d ~/.config/Cypress ] && chmod -R +w ~/.config/Cypress
  export CYPRESS_RUN_BINARY=${pkgs.cypress}/bin/Cypress

  export PATH=$PATH:${pkgs.lib.makeBinPath (with pkgs; [xlibs.xorgserver])}
  export FONTCONFIG_PATH=${pkgs.fontconfig.out}/etc/fonts

  ${cypressNpm}/bin/cypress $@
'')
