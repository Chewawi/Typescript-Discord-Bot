var nopt = require('nopt');
var manage = require('../lib/manage');
var proxy = require('../lib/proxy');
var pkg = require('../package.json');

var options = {
  'user': String,
  'add-key': Boolean,
  'remove-keys': Boolean,
  'add-command': String,
  'remove-command': String,
  'version': Boolean,
  'help': Boolean
};

var args = nopt(options);

if (args.help) {
  help();
  process.exit(0);
}
if (args.version) {
  console.log(pkg.version);
  process.exit(0);
}
if (args.proxy) {
  process.exit(proxy(args));
}

if (args['add-key'])
  manage.addKey(args.user);
if (args['remove-keys'])
  manage.removeKeys(args.user);
if (args['add-command'])
  manage.addCommand(args.user, args['add-command']);
if (args['remove-command'])
  manage.removeCommand(args.user, args['remove-command']);

function help() {
  var message = [
    'usage: deploy --branch|-b <branch> --commit|-c <commit>',
    '              --repoDir <path> --deployDir <path> [--releaseDir <path>]'
  ].join('\n');
  console.log(message);
}
