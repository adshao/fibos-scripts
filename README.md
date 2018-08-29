# FIBOS Registration Scripts

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

### Exchange EOS for FO

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

## Donate

If this script is helpful to you, you can donate me with a cup of coffee:

- EOS Address: adshaoadshao
- FO Address: adshaoadshao

Thanks, good luck!
