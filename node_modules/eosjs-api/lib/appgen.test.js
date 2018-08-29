'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint-env mocha */
var assert = require('assert');
var camelCase = require('camel-case');
var apiGen = require('./apigen');

var apiVersions = {
  v1: require('./api/v1')
};

describe('API Generator', function () {
  it('usage', function (done) {
    var api = apiGen('v1', apiVersions.v1);
    api.getInfo(); // no args triggers usage
    done();
  });

  it('optionsFormatter', function () {
    var api = apiGen('v1', apiVersions.v1);
    api.getInfo(true);
  });

  var _loop = function _loop(version) {
    describe(version, function () {
      var definitions = apiVersions[version];
      var api = apiGen(version, definitions);

      var _loop2 = function _loop2(apiGroup) {
        describe(apiGroup, function () {
          var _loop3 = function _loop3(apiMethod) {
            var methodName = camelCase(apiMethod);
            it(methodName, function () {
              assert.equal(_typeof(api[methodName]), 'function');
            });
          };

          for (var apiMethod in apiVersions[version][apiGroup]) {
            _loop3(apiMethod);
          }
        });
      };

      for (var apiGroup in definitions) {
        _loop2(apiGroup);
      }
    });
  };

  for (var version in apiVersions) {
    _loop(version);
  }
});

describe('fetch', function () {
  var definitions = apiVersions.v1;
  var config = { fetchConfiguration: { credentials: 'same-origin' } };
  var api = apiGen('v1', definitions, config);

  it('getBlock', function (done) {
    api.getBlock({ block_num_or_id: 2 }, function (err, block) {
      if (err) {
        throw err;
      }
      assert(block.id, 'block.id');
      done();
    });
  });
});

it('logging', function (done) {
  var apiLog = void 0;
  var config = {
    verbose: true,
    logger: {
      log: function log() {
        // console.log(...args)
        apiLog = true;
      },
      error: function error() {
        for (var _len = arguments.length, err = Array(_len), _key = 0; _key < _len; _key++) {
          err[_key] = arguments[_key];
        }

        // console.log(...err)
        assert(/callback error/.test(err.join(' ')), 'callback error');
        done();
      }
    }
  };

  var api = apiGen('v1', apiVersions.v1, config);

  api.getBlock(1, function () {
    assert(apiLog, 'apiLog');
    throw 'callback error';
  });
});

it('api promise error', async function () {
  var errorLog = void 0,
      apiLog = void 0;
  var config = {
    logger: {
      error: function error(e) {
        errorLog = true;
      },
      log: function log(s) {
        apiLog = true;
      }
    }
  };
  var api = apiGen('v1', apiVersions.v1, config);

  await api.getBlock(1);
  assert(apiLog, 'apiLog');
  assert(!errorLog, '!errorLog');

  await api.getBlock('a').catch(function (e) {
    assert(errorLog, 'errorLog');
  });
});

it('api callback error', function () {
  var errorLog = void 0;
  var config = { logger: { error: function error(e) {
        errorLog = true;
      } } };
  var api = apiGen('v1', apiVersions.v1, config);
  return api.getBlock('a', function (error) {
    throw new Error('callback error');
  });
});