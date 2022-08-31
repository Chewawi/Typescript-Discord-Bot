var aux = require('../lib/aux');

// ssh -p 2222  -i ~/.vagrant.d/insecure_private_key -l vagrant 127.0.0.1
var test1 = {
  user: 'vagrant',
  host: '127.0.0.1',
  p: 2222,
  i: process.env.HOME + '/.vagrant.d/insecure_private_key'
};

var test = aux.remote(test1);
aux.local('ls -al').pipe(process.stdout);
test('ls -al').pipe(process.stdout);
