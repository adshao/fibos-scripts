'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = require('assert');
var Structs = require('./structs');

module.exports = AbiCache;

function AbiCache(network, config) {
  config.abiCache = {
    abiAsync: abiAsync,
    abi: abi

    // Help (or "usage") needs {defaults: true}
  };var abiCacheConfig = Object.assign({}, { defaults: true }, config);

  var cache = {};

  /**
    Asynchronously fetch and cache an ABI from the blockchain.
     @arg {string} account - blockchain account with deployed contract
    @arg {boolean} [force = true] false when ABI is immutable.
  */
  function abiAsync(account) {
    var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    assert.equal(typeof account === 'undefined' ? 'undefined' : (0, _typeof3.default)(account), 'string', 'account string required');

    if (force == false && cache[account] != null) {
      return Promise.resolve(cache[account]);
    }

    if (network == null) {
      var _abi = cache[account];
      assert(_abi, 'Missing ABI for account: ' + account + ', provide httpEndpoint or add to abiCache');
      return Promise.resolve(_abi);
    }

    return network.getAbi(account).then(function (code) {
      assert(code.abi, 'Missing ABI for account: ' + account);
      return abi(account, code.abi);
    });
  }

  /**
    Synchronously set or fetch an ABI from local cache.
     @arg {string} account - blockchain account with deployed contract
    @arg {string} [abi] - blockchain ABI json data.  Null to fetch or non-null to cache
  */
  function abi(account, abi) {
    assert.equal(typeof account === 'undefined' ? 'undefined' : (0, _typeof3.default)(account), 'string', 'account string required');
    if (abi) {
      assert.equal(typeof abi === 'undefined' ? 'undefined' : (0, _typeof3.default)(abi), 'object', 'abi');
      if (Buffer.isBuffer(abi)) {
        abi = JSON.parse(abi);
      }
      var schema = abiToFcSchema(abi);
      var structs = Structs(abiCacheConfig, schema); // structs = {structs, types}
      return cache[account] = Object.assign({ abi: abi, schema: schema }, structs);
    }
    var c = cache[account];
    if (c == null) {
      throw new Error('Abi \'' + account + '\' is not cached');
    }
    return c;
  }

  return config.abiCache;
}

function abiToFcSchema(abi) {
  // customTypes
  // For FcBuffer
  var abiSchema = {};

  // convert abi types to Fcbuffer schema
  if (abi.types) {
    // aliases
    abi.types.forEach(function (e) {
      abiSchema[e.new_type_name] = e.type;
    });
  }

  if (abi.structs) {
    abi.structs.forEach(function (e) {
      var fields = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = e.fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var field = _step.value;

          fields[field.name] = field.type;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      abiSchema[e.name] = { base: e.base, fields: fields };
      if (e.base === '') {
        delete abiSchema[e.name].base;
      }
    });
  }

  return abiSchema;
}