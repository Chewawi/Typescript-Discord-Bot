var exec = require('child_process').exec;
var duplex = require('duplexer');

var aux = {};

module.exports = aux;


aux.remote = remote;
aux.realm = realm;
aux.local = remote();

function remote(options) {
  var local = (!options)?true:false;
  options = options || {};
  var ignore = ['host', 'verbose'];
  var _args = [];
  if (options.user) {
    options.l = options.user;
    delete options.user;
  }
  for (var _opt in options) {
    if (ignore.indexOf(_opt) == -1 && options.hasOwnProperty(_opt)) {
      _args.push('-' + _opt);
      _args.push('' + options[_opt]);
    }
  }
  if (!local) _args.push(options.host || '127.0.0.1');
  function handler() {
    var args = Array.prototype.slice.call(arguments);
    var callback, cmd;
    if (typeof args[args.length-1] == 'function') {
      callback = args.pop();
    }
    cmd = '"' + args.join('&&') + '"';
    if (!local) {
      _args.push(cmd);
      cmd = 'ssh ';
    }
    var result = exec(cmd + _args.join(' '), function (err, stdout, stderr) {
      if (options.verbose) {
        var uri = 'ssh://%s@%s:%s';
        console.log('\u001b[36m' + uri + '\u001b[39m',
                    options.l, options.host, options.p);
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        if (err) process.exit(err.code);
      }
      if (callback) callback(err, stdout);
    });
    var stream = duplex(result.stdin, result.stdout);
    stream.stdout = result.stdout;
    stream.stdin = result.stdin;
    stream.stderr = result.stderr;
    return stream;
  }
  return handler;
}

function realm() {
  var hosts = Array.prototype.slice.call(arguments);
  return function handler() {
    var _arguments = arguments;
    hosts.forEach(function (opt) {
      opt.verbose = true;
      var handler = remote(opt);
      handler.apply(this, _arguments);
    });
  };
}
