// see https://github.com/msgpack/msgpack-node.git
// This code was modified to test/benchmark/benchmark.js

var fs        = require('fs'),
    sys       = require('sys'),
    msgpack   = require('msgpack'),
    msgpackjs = require('msgpack-js')

var DATA_TEMPLATE = {'abcdef' : 1, 'qqq' : 13, '19' : [1, 2, 3, 4]};
var DATA = [];

for (var i = 0; i < 1000000; i++) {
    DATA.push(JSON.parse(JSON.stringify(DATA_TEMPLATE)));
}

function _set_up(callback) {
  this.backup = {};
  callback();
}

function _tear_down(callback) {
  callback();
}

exports.benchmark = {
  setUp : _set_up,
  tearDown : _tear_down,
  'msgpack.pack faster than JSON.stringify with array of 1m objects' : function (test) {
    console.log();
    var jsonStr;
    var now = Date.now();
    jsonStr = JSON.stringify(DATA);
    var stringifyTime = (Date.now() - now);

    var mpBuf;
    now = Date.now();
    mpBuf = msgpack.pack(DATA);
    var packTime = (Date.now() - now);

    var mpjsBuf;
    now = Date.now();
    mpjsBuf = msgpackjs.encode(DATA);
    var encodeTime = (Date.now() - now);

    console.log(
      "msgpack.pack: "+packTime+"ms, msgpack-js.encode: "+encodeTime+"ms, JSON.stringify: "+stringifyTime+"ms"
    );
    console.log(
      "ratio of msgpack.pack/JSON.stringify:    " + packTime/stringifyTime
    );
    console.log(
      "ratio of msgpack.pack/msgpack-js.encode: " + packTime/encodeTime
    );
    test.expect(1);
    test.ok(
      packTime < stringifyTime,
      "msgpack.pack: "+packTime+"ms, JSON.stringify: "+stringifyTime+"ms"
    );
    test.done();
  },
  'JSON.stringify faster than msgpack.pack over 1m calls' : function (test) {
    console.log();

    var jsonStr;
    var now = Date.now();
    DATA.forEach(function(d) {
        jsonStr = JSON.stringify(d);
    });
    var stringifyTime = (Date.now() - now);

    var mpBuf;
    now = Date.now();
    DATA.forEach(function(d) {
        mpBuf = msgpack.pack(d);
    });
    var packTime = (Date.now() - now);

    var mpjsBuf;
    now = Date.now();
    DATA.forEach(function(d) {
        mpjsBuf = msgpackjs.encode(d);
    });
    var encodeTime = (Date.now() - now);

    console.log(
      "msgpack.pack: "+packTime+"ms, msgpack-js.encode: "+encodeTime+"ms, JSON.stringify: "+stringifyTime+"ms"
    );
    console.log(
      "ratio of msgpack.pack/JSON.stringify:    " + packTime/stringifyTime
    );
    console.log(
      "ratio of msgpack.pack/msgpack-js.encode: " + packTime/encodeTime
    );
    test.expect(1);
    test.ok(
      stringifyTime < packTime && packTime/stringifyTime < 6,
      "msgpack.pack: "+packTime+"ms, msgpack-js.encode: "+encodeTime+"ms, JSON.stringify: "+stringifyTime+"ms"
    );
    test.done();
  },
  'JSON.parse faster than msgpack.unpack over 1m calls' : function (test) {
    console.log();
    var jsonStr;

    DATA.forEach(function(d) {
        jsonStr = JSON.stringify(d);
    });

    var mpBuf;
    DATA.forEach(function(d) {
        mpBuf = msgpack.pack(d);
    });

    var mpjsBuf;
    DATA.forEach(function(d) {
        mpjsBuf = msgpackjs.encode(d);
    });

    var now = Date.now();
    DATA.forEach(function(d) {
        JSON.parse(jsonStr);
    });
    var parseTime = (Date.now() - now);

    now = Date.now();
    DATA.forEach(function(d) {
        msgpack.unpack(mpBuf);
    });
    var unpackTime = (Date.now() - now);

    now = Date.now();
    DATA.forEach(function(d) {
        msgpackjs.decode(mpjsBuf);
    });
    var decodeTime = (Date.now() - now);

    console.log(
      "msgpack.unpack: "+unpackTime+"ms, msgpack-js.decode: "+decodeTime+"ms, JSON.parse: "+parseTime+"ms"
    );
    console.log(
      "ratio of msgpack.unpack/JSON.parse:        " + unpackTime/parseTime
    );
    console.log(
      "ratio of msgpack.unpack/msgpack-js.decode: " + unpackTime/decodeTime
    );
     test.expect(1);
    test.ok(
      parseTime < unpackTime && unpackTime/parseTime < 5,
      "msgpack.unpack: "+unpackTime+"ms, JSON.parse: "+parseTime+"ms"
    );
    test.done();
  },
  'output above is from three runs on a 1m element array of objects' : function (test) {
    console.log();
    for (var i = 0; i < 3; i++) {
      var mpBuf;
      var now = Date.now();
      mpBuf = msgpack.pack(DATA);
      console.log('msgpack    pack:   ' + (Date.now() - now) + ' ms');
    
      now = Date.now();
      msgpack.unpack(mpBuf);
      console.log('msgpack    unpack: ' + (Date.now() - now) + ' ms');
    
      var mpjsBuf;
      now = Date.now();
      mpjsBuf = msgpackjs.encode(DATA);
      console.log('msgpack-js encode: ' + (Date.now() - now) + ' ms');
    
      now = Date.now();
      msgpackjs.decode(mpjsBuf);
      console.log('msgpack-js decode: ' + (Date.now() - now) + ' ms');
    
      var jsonStr;
      now = Date.now();
      jsonStr = JSON.stringify(DATA);
      console.log('json       pack:   ' + (Date.now() - now) + ' ms');
    
      now = Date.now();
      JSON.parse(jsonStr);
      console.log('json       unpack: ' + (Date.now() - now) + ' ms');
      console.log();
    }

    test.expect(1);
    test.ok(1);
    test.done();
  },
  'output above is from three runs of 1m individual calls' : function (test) {
    console.log();
    for (var i = 0; i < 3; i++) {
      var mpBuf;
      var now = Date.now();
      DATA.forEach(function(d) {
        mpBuf = msgpack.pack(d);
      });
      console.log('msgpack    pack:   ' + (Date.now() - now) + ' ms');
    
      now = Date.now();
      DATA.forEach(function(d) {
        msgpack.unpack(mpBuf);
      });
      console.log('msgpack    unpack: ' + (Date.now() - now) + ' ms');
    
      var mpjsBuf;
      var now = Date.now();
      DATA.forEach(function(d) {
        mpjsBuf = msgpackjs.encode(d);
      });
      console.log('msgpack-js encode: ' + (Date.now() - now) + ' ms');
    
      now = Date.now();
      DATA.forEach(function(d) {
        msgpackjs.decode(mpjsBuf);
      });
      console.log('msgpack-js decode: ' + (Date.now() - now) + ' ms');
    
      var jsonStr;
      now = Date.now();
      DATA.forEach(function(d) {
        jsonStr = JSON.stringify(d);
      });
      console.log('json       pack:   ' + (Date.now() - now) + ' ms');
    
      now = Date.now();
      DATA.forEach(function(d) {
        JSON.parse(jsonStr);
      });
      console.log('json       unpack: ' + (Date.now() - now) + ' ms');
      console.log();
    }

    test.expect(1);
    test.ok(1);
    test.done();
  }
};
