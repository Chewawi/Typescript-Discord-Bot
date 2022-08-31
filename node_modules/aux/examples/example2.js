var aux = require('../lib/aux');

var test1 = {
  user: 'vagrant',
  host: '127.0.0.1',
  p: 2222,
  i: process.env.HOME + '/.vagrant.d/insecure_private_key'
};
var test2 = {
  user: 'vagrant',
  host: '127.0.0.1',
  p: 2200,
  i: process.env.HOME + '/.vagrant.d/insecure_private_key'
};
var test3 = {
  user: 'vagrant',
  host: '127.0.0.1',
  p: 2201,
  i: process.env.HOME + '/.vagrant.d/insecure_private_key'
};

var test = aux.realm(test1, test2, test3);
test('ls');
