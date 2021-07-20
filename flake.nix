{
  description = "Reproducible toolchain for building and testing Supervisor Lookup";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-21.05";
    mvn2nix-pkgs.url = "github:johannesloetzsch/mvn2nix/master";
  };

  outputs = { self, nixpkgs, mvn2nix-pkgs }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs { system="x86_64-linux";
                            overlays = [ (import ./frontend/nix/deps/cypress/cypress-overlay.nix) ];
                          };
    mvn2nix = mvn2nix-pkgs.legacyPackages.x86_64-linux.mvn2nix;
    buildMavenRepositoryFromLockFile = mvn2nix-pkgs.legacyPackages.x86_64-linux.buildMavenRepositoryFromLockFile;
  in
  rec {
    legacyPackages.x86_64-linux = {
      inherit nixpkgs pkgs;

      ## Tools
      backendUpdateDeps = import ./backend/nix/tools/update-deps.nix { inherit pkgs mvn2nix; };
      frontendCodegen = import ./frontend/nix/tools/codegen.nix { inherit pkgs; };
      frontendUpdateDeps = import ./frontend/nix/tools/update-deps.nix { inherit pkgs; };
      cypress = import ./frontend/nix/deps/cypress/override.nix { inherit pkgs; };

      ## Builds
      backend = import ./backend/nix/swlkup-backend.nix { inherit pkgs buildMavenRepositoryFromLockFile; };
      frontend = import ./frontend/nix/swlkup-frontend.nix { inherit pkgs; };
      fullstack =  import ./backend/nix/swlkup-backend.nix { inherit pkgs buildMavenRepositoryFromLockFile;
                                                             patchPublic = legacyPackages.x86_64-linux.frontend.staticHTML; };
    };

    defaultPackage.x86_64-linux = legacyPackages.x86_64-linux.fullstack;
  };
}
