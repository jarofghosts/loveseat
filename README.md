loveseat
===

Sometimes you don't need the whole couch.

## usage

````js
var Loveseat = require('loveseat').Loveseat,
  db = new Loveseat({ db: 'mydb' });

db.insert({ "name": "My Document" }, function (err, res) {
  console.log(res);
});
````

## other options

when making a `new Loveseat`, available options are:
* `db`: the name of the db, defaults to "test"
* `url`: the url to the couchdb, defaults to "http://localhost:5984/" and should be in that format if customized.

## API

* `db.insert([ id,] document [, callback])` Insert (or update) a document with optional `id`
* `db.destroy(id, rev [, callback])` Delete document with `id`, revision `rev`
* `db.get(id [, callback])` Get document by `id`
* `db.create([callback])` Creates the database if it does not already exist
* `db.check([callback])` Checks for the presence of your selected db

## license

BSD
