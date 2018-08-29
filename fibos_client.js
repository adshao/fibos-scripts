var FIBOS = require("fibos.js");
var cfg = require("./config.js");
var http = require('http');

var FibosClient = module.exports = function(config){
    this.init(config);
};

(function(){

this.init = function(config) {
    var self = this;
    
    self.eosPriKey = config && config.eosPriKey;
    self.eosAccount = config && config.eosAccount;
    self.fibosAccount = config && config.fibosAccount;
    self.fibosPubKey = config && config.fibosPubKey;
    self.fibosPriKey = config && config.fibosPriKey;
    
    self.fibosClient = FIBOS({
        chainId: cfg.fibos_chainid,
        keyProvider: self.fibosPriKey,
        httpEndpoint: cfg.fibos_endpoint,
        verbose: false,
        logger: {
            log: null,
            error: null
        }
    });
    self.eosClient = FIBOS({
        chainId: cfg.eos_chainid,
        keyProvider: self.eosPriKey,
        httpEndpoint: cfg.eos_endpoint,
        verbose: false,
        logger: {
            log: null,
            error: null
        }
    });
}

this.generateKeys = function() {
    var self = this;
    var prikey = FIBOS.modules.ecc.randomKeySync(); //私钥
    var pubkey = FIBOS.modules.ecc.privateToPublic(prikey); //公钥

    return {pubkey: pubkey, prikey: prikey}
};

this.createAccount = function(account) {
    var self = this;
    var httpClient = new http.Client();
    var httpServerHost = cfg.fibos_http_server_host;
    var pubkey = self.fibosPubKey;
    var res = httpClient.post(httpServerHost, {
        json: {
                account: account || self.fibosAccount,
                pubkey: pubkey
        }
    }).json()
    if (res.message == "success") {
        self.fibosAccount = account;
    }
    return res;
};

// value format: 1.0000 EOS
this.transferEOS = function(value) {
    var self = this;
    var eosAccount = self.eosAccount;
    var memo = self.fibosAccount;
    var fibosRemoteAccount = cfg.fibos_remote_account;
    var ctx = self.eosClient.contractSync("eosio.token");
    var res = ctx.transferSync(eosAccount, fibosRemoteAccount, value, memo);
    return res;
};

this.withdrawEOS = function(value) {
    var self = this;
    var fibosAccount = self.fibosAccount;
    var memo = self.eosAccount;
    var fibosRemoteAccount = cfg.fibos_remote_account;
    var ctx = self.fibosClient.contractSync("eosio.token");
    var res = ctx.transferSync(fibosAccount, fibosRemoteAccount, value, memo);
    return res;
}

this.getBalance = function(account) {
    var self = this;
    var targetAccount = account || self.fibosAccount;
    var res = self.fibosClient.getTableRowsSync(true, "eosio.token", targetAccount, "accounts");
    return res;
};

this.exchangeFO = function(value) {
    var self = this;
    let ctx = self.fibosClient.contractSync("eosio.token");
    var res = ctx.exchangeSync(self.fibosAccount, value + "@eosio", `0.0000 FO@eosio`, `exchange EOS to FO`, {
        authorization: self.fibosAccount
    });
    return res;
};

this.exchangeEOS = function(value) {
    var self = this;
    let ctx = self.fibosClient.contractSync("eosio.token");
    var res = ctx.exchangeSync(self.fibosAccount, value + "@eosio", `0.0000 EOS@eosio`, `exchange FO to EOS`, {
        authorization: self.fibosAccount
    });
    return res;
}

// "acount", "acount", "100.0000 FO"
this.buyram = function(payer, receiver, value) {
    var self = this;
    var res = self.fibosClient.buyramSync(payer, receiver, value)
    return res;
};

this.sellram = function(receiver, bytes) {
    var self = this;
    var res = self.fibosClient.sellramSync(receiver, bytes)
    return res
}

this.getRamPrice = function() {
    var self = this;
    var rs = self.fibosClient.getTableRowsSync(true, "eosio", "eosio", "rammarket");
    var a = parseFloat(rs.rows[0].quote.balance.split(" ")[0]);
    var b = parseFloat(rs.rows[0].base.balance.split(" ")[0]);
    var price = a / b * 1024;
    return price + " FO/KB"
}

this.getAccount = function(account) {
    var self = this;
    return self.fibosClient.getAccountSync(account)
}

}).call(FibosClient.prototype);
