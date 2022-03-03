# Setup on Debian 11

## Create User

The systemd unit expects an unprivileged user called `swlkup` with his home directory in `/home/swlkup`.

```sh
sudo adduser --system swlkup
```

The following commands assume to be run by this user, except they use `sudo`:

```sh
(cd ~swlkup && sudo -u swlkup bash)
```


## Install dependencies

```sh
sudo apt install openjdk-17-jdk mailutils
```

This tools are not required, but I tend to use them:

```sh
sudo apt install tmux vim htop
```


## Download/Update swlkup + integrity check

```sh
wget https://github.com/johannesloetzsch/swlkup/releases/download/${LATEST}/swlkup.jar
sha256sum swlkup.jar
```

This should match the hash of a local build of the same commit:

```sh
sha256sum $(nix eval --raw .#fullstack.jar)/*.jar
```


## Configuration

```sh
wget https://raw.githubusercontent.com/johannesloetzsch/swlkup/master/backend/src/config.edn
```

A minimal configuration requires setting `:frontend-base-url` and `:frontend-backend-base-url`.

```sh
CONFIG=config.edn java -jar swlkup.jar
```


## Systemd Service

Setup:

```sh
curl https://raw.githubusercontent.com/johannesloetzsch/swlkup/master/deployment/swlkup.service | sudo tee /etc/systemd/system/swlkup.service
sudo systemctl daemon-reload
sudo systemctl enable swlkup.service
sudo systemctl start swlkup.service
```

Debug:

```sh
sudo systemctl status swlkup.service
sudo journalctl -u swlkup.service
```


## Enable encrypted db exports

```sh
sudo apt install gpg
```

In `config.edn` check `:admin-gpg-id` and set `:admin-passphrase`.

A passphrase could be generated with:

```sh
pwgen -syn 20 -r '"\'  ## be aware that we exclude characters that would need to be escaped
```

Import the public key and trust it:

```sh
curl https://raw.githubusercontent.com/johannesloetzsch/swlkup/master/deployment/keys/j03.gpg | gpg --import
echo -e "5\ny\n" | gpg --command-fd 0 --expert --edit-key $ADMIN_GPG_ID trust
```

[Test the feature](../backend/src/swlkup/resolver/root/admin/Export.md)


# Hosting of current deployment

## Backups

On 02.03.2022 Jonas wrote:
> Backups machen wir von den VMs einmal pro Tag. Die Backup Server stehen in zwei anderen Landern plus die VM hat HA aktiviert, das heiszt wenn der Server unter der VM wegbricht sollte sie direkt auf einem anderen Host mit dem selben state neu gespawned werden.
