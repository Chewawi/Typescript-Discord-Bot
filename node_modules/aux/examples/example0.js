var assert = require('assert');
var aux = require('../lib/aux');

// Preliminary tests
aux.local('echo "TEST"', 'ls');
aux.local('ls /').stdout.pipe(process.stdout);
//
//console.log('remote');
var test1 = aux.remote({host: 'test1.aux-remote'});
test1('ls', 'cat aux_test', function (err, stdout) {
  if (err) throw err;
  console.log('---');
  console.log(stdout);
  console.log('---');
});
test1('echo "TESTING" > aux_test2');

var test2 = aux.remote({host: 'test2.aux-remote'});
test2('ls').pipe(test1('tee aux_test3')).pipe(process.stdout);
var realm = aux.realm({host: 'test1.aux-remote'}, {host: 'test2.aux-remote'});
//realm('ls');

if (process.argv[2] == 'remove') {
  test1('rm aux_test2', 'rm aux_test3');
}
