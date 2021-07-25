{ pkgs }:
(pkgs.writeScriptBin "deploy" ''
  #!${pkgs.runtimeShell} -e
  export PATH="${pkgs.stdenv.lib.makeBinPath (with pkgs; [github-release])}"

  ## $GITHUB_TOKEN must be a `personal access token` with scope `public_repo`.
  ## The owner of the token must be projekt owner of the repo.
  [ -n "$GITHUB_TOKEN" ]

  export GITHUB_USER="$CIRCLE_PROJECT_USERNAME"
  export GITHUB_REPO="$CIRCLE_PROJECT_REPONAME"
  export TAG="''${CIRCLE_TAG:-$CIRCLE_BRANCH}"

  export FILE="$1"
  export NAME="$2"

  if github-release info -t $TAG ; then
     github-release delete -t $TAG
  fi
  github-release release -t $TAG

  github-release upload -t $TAG -f "$FILE" -n "$NAME"
'')
