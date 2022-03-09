{ pkgs }:
(pkgs.writeScriptBin "deploy" ''
  #!${pkgs.runtimeShell} -e
  export PATH="${pkgs.lib.makeBinPath (with pkgs; [github-release coreutils])}"

  ## $GITHUB_TOKEN must be a `personal access token` with scope `public_repo`.
  ## The owner of the token must be projekt owner of the repo.
  [ -n "$GITHUB_TOKEN" ]

  export GITHUB_USER="$CIRCLE_PROJECT_USERNAME"
  export GITHUB_REPO="$CIRCLE_PROJECT_REPONAME"
  export TAG="''${CIRCLE_TAG:-$CIRCLE_BRANCH}"

  export FILE="$1"
  export NAME="$2"

  echo "Delete an old release in case it exists…"
  if github-release info -t $TAG ; then
     github-release delete -t $TAG
  fi
  echo "Create a new release…"
  github-release release -t $TAG || true

  ## TODO: await release to be created, for now we wait + print debug output
  echo 'existing?'
  github-release info -t $TAG || true
  sleep 10
  echo 'existing after waiting?'
  github-release info -t $TAG || true

  echo "Upload Artifacts"
  github-release upload -t $TAG -f "$FILE" -n "$NAME"
'')
