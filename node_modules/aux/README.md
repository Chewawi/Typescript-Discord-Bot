# aux - DRAFT

To simplify scripting access to multiple machines, we present here a simple API
that makes running commands on a POSIX compliant system, either local or
remote, nothing short of a breeze.

Remote commands are run via ssh, and the aux binary can work as a proxy script,
that enables an administrator to granulate access control.

## Install

### Server

On the machine you wish to control, you will probably want to use aux as a
proxy script. This allows you to restrict client access to only pre specified
commands. In this case you should just run:
```
npm install -g aux
```

### Client project

When using the aux library to control some machines from your application, just
install as a dependency:
```
npm install aux
```

## Usage

### Server

```
aux --user <username> --add-key <pub_key>
aux --user <username> --remove-key
aux [--user <username>] --add-command <command>
aux [--user <username>] --remove-command <command>
```

### Client project

```javascript
var aux = require('aux');

aux.testing = new aux.remote({host: 'testing.example.com'});
aux.staging = new aux.remote(
  {host: 'staging1.example.com'},
  {host: 'staging2.example.com'},
  {host: 'staging3.example.com'});

// optional callback with args: ({Error}, {Array})
aux.local('command', callback); 
aux.testing('command1', 'command2');
// if callback is provided, it is called when all servers have responded, with
// args: ({Error}, {Array})
aux.staging('command', callback); 
```

## Usage example

As a contrived example, say we want enable the happy user, Fred, restart nginx
on our Ubuntu server

1. First we add Fred's public authentication key to our server
```
aux --user fred --add-key "ssh-rsa AAAA...=="
```
2. Next we allow Fred to restart any service on the system
```
aux --user fred --add-command "sudo service \w+ restart"
```
3. Create a simple script for Fred to use on his machine

```javascript
var aux = require('aux');

var server = new aux.remote({host: 'example.com'});
server('sudo service nginx restart', function (err, result) {
  if (err) throw err;
  console.log(result.join('\n\n'));
});
```

Now Fred can simply call this script to restart nginx on the server.
```
node restart_nginx.js
```

## Examples

```javascript
var aux = require('aux');

var host1 = {host: 'host1.example.com'};
var host2 = {host: 'host2.example.com', user: 'another_user'};
var host3 = {host: 'host3.example.com'};
var host3 = {host: 'host3.example.com'};

var remote = new aux.remote(host4);
var realm1 = new aux.realm(host1, host2, host3);
var realm2 = new aux.realm(remote, host3);
var realm3 = new aux.realm(realm1, realm2);

remote('cmd', function (err, result) {});
realm1('cmd', 'cmd2', function (err, result) {
  // result  is an array of all the results
});
```

Remotes are streamable
```javascript
var aux = require('aux');

var server1 = aux.remote({host: 'server1.example.com'});
var server2 = aux.remote({host: 'server2.example.com'});

server1('cmd').pipe(server2('cmd2'));
```

