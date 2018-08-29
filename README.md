# FIBOS Registration Scripts

## Run with Docker

Docker is required before running following command, please refer to https://docs.docker.com/install/ to install docker.

One line installation:

```shell
git clone https://github.com/adshao/fibos-scripts && cd fibos-scripts && alias fibos="docker run -it --rm -v `pwd`:/usr/src/app -w /usr/src/app adshao/fibos fibos"
```

or just set alias if you have already cloned this repo:
```shell
alias fibos="docker run -it --rm -v `pwd`:/usr/src/app -w /usr/src/app adshao/fibos fibos"
```

Goto Usage section to continue the journey.

## Pre-installation

### Install fibos

```shell
curl -s https://fibos.io/download/installer.sh | sh
```

### Init fibos

```shell
fibos --init
```

### Install fibos.js

```shell
fibos --install fibos.js
```

for more information, please refer to https://fibos.io/docs/guide/basic/install.md.html

## Usage

Put the following javascript code into a file named main.js, run with fibos once the code is ready:

```shell
fibos main.js
```

### Init Client

Init fibos client

```javascript
var FibosClient = require("./fibos_client.js");

config = {
    eosPriKey: process.env.EOS_PRIKEY,
    eosAccount: "your eos account",
    fibosAccount: "your fibos account",
    fibosPubKey: process.env.FIBOS_PUBKEY,
    fibosPriKey: process.env.FIBOS_PRIKEY
}

var client = new FibosClient(config);
```

### Generate Pub/Pri Keys

```javascript
var res = client.generateKeys();
console.log("export FIBOS_PRIKEY=" + res.prikey);
console.log("export FIBOS_PUBKEY=" + res.pubkey);
```

Save it into a secure key named fibos.key, and append your EOS private key:
```shell
export FIBOS_PRIKEY=xxx
export FIBOS_PUBKEY=xxx
export EOS_PRIKEY=xxx
```

```shell
source fibos.key
```

### Create Account

```javascript
var res = client.createAccount();
console.log(res);
```

### Transfer EOS to FIBOS

```javascript
var res = client.transferEOS("1.0000 EOS");
console.log(res);
```

### Check Balance

```javascript
var res = client.getBalance(config.fibosAccount);
console.log(res);
```

### Exchange EOS to FO

```javascript
var res = client.exchangeFO("1.0000 EOS");
console.log(res);
```

### Buy Ram

```javascript
var res = client.buyram(config.fibosAccount, config.fibosAccount, "1.0000 FO");
console.log(res);
```

### Sell Ram

Sell ram in bytes:
```javascript
var res = client.sellram(config.fibosAccount, 1048576)
console.log(res);
```

### Show Ram Price

```javascript
console.log("ram price: " + client.getRamPrice());
```

### Get Account

Check your ram info from account:
```javascript
console.log(client.getAccount(config.fibosAccount));
```

### Exchange FO to EOS

In case you want to exchange FO to EOS:
```javascript
var res = client.exchangeEOS("1.0000 FO");
console.log(res);
```

### Withdraw EOS

Transfer EOS@fibos to EOS mainnet:
```javascript
var res = client.withdrawEOS("0.0012 EOS")
console.log(res);
```

Please test with a small amount to make sure everything is OK before transfering your EOS.

## Donate

If this script is helpful to you, you can donate me with a cup of coffee:

- EOS Address: adshaoadshao
- FO Address: adshaoadshao

Thanks, good luck!
