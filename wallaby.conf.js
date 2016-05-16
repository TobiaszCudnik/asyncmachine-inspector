module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.js'
    ],

    tests: [
      'build-test/no-ui/*.js'
    ],
    env: {
      type: 'node',
      runner: 'node'  // or full path to any node executable
    }
  };
};