var Loveseat = require('../index.js').Loveseat,
  assert = require('assert'),
  db;

assert.doesNotThrow(function () {
  db = new Loveseat();
});

db.create(function (err, res) {
  console.log(res);
  db.check(function (err, res) {
    console.log(res);
  });
});
