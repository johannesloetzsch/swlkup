FROM johannesloetzsch/nix-flake

RUN mkdir /source/
COPY . /source/
WORKDIR /source/

CMD nix run
