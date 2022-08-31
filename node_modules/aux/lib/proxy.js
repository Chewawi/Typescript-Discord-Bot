module.exports = function (args) {
  if (!args.user) {
    console.error('Please provide a user');
    return 1;
  }
}; 
