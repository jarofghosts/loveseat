var Loveseat = require('../index.js').Loveseat,
  assert = require('assert'),
  db;

assert.doesNotThrow(function () {
  db = new Loveseat();
});

db.create(function (err, res) {
  assert.ok(!err);
  db.check(function (err, res) {
    assert.ok(!err);
    assert.equal(res.db_name, 'test');
  });
});

db.insert({ "hello": "world" }, function (err, res) {
  console.log(res);
});
