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
    doNext();
  });
});
function doNext() {
  db.insert({ hello: 'world' }, function (err, res) {
    var id = res.id, rev = res.rev;
    assert.ok(id && rev);
    db.get(id, function (err, res) {
      assert.equal(res.hello, 'world');
      db.insert(id, { hello: 'dolly', '_rev': rev }, function (err, res) {
        assert.ok(res.ok);
        rev = res.rev;
        db.get(id, function (err, res) {
          assert.equal(res.hello, 'dolly');
          db.destroy(id, res._rev, function (err, res) {
            assert.ok(res.ok);
            db.get(id, function (err, res) {
              assert.equal(res.error, 'not_found');
              assert.equal(res.reason, 'deleted');
              doLast();
            });
          });
        });
      });
    });
  });

}
function doLast() {
  db.insert('loveseat-test', { hey: 'now' }, function (err, res) {
    var rev = res.rev;
    assert.ok(rev);
    db.get('loveseat-test', function (err, res) {
      assert.equal(res.hey, 'now');
      db.destroy('loveseat-test', rev);
    });
  });
}
