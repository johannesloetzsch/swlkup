{ pkgs }:

pkgs.mkShell {
  buildInputs = with pkgs; [ coreutils ];
  shellHook = ''
    set -e
    cd backend
    export PATH=./resources/mock:$PATH
    export DB_INMEMORY=true
    export DB_SEED=./src/swlkup/db/seed/example.edn

    echo '## To start the backend run one of this commands:'
    echo '> nix run'
    echo '> lein run'
    echo
    echo '## To start a dev build of the frontend:'
    echo '> (cd ../frontend; npm run dev)'
    echo
    echo '## To run the integration tests:'
    echo '> export CYPRESS_BASE_URL=http://localhost:4000  ## in case of using the fullstack build'
    echo '> (cd ../frontend; nix run .#cypress run)'
    echo
  '';
}
