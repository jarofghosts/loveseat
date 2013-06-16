var request = require('request');

function makeRequest(loveseat, method, url, data, callback) {

  var options = {
      url: loveseat.url + loveseat.db + '/' + url,
      method: method
    };

  if (data) { options.json = data; }

  request(options, function (err, res, body) {
    if (res.statusCode == 409) {
      callback(JSON.stringify(body));
    } else {
      callback(null, body);
    }
  });

}
function Loveseat(options) {

  this.url = options.url || 'http://localhost:5849/';
  this.db = options.db || 'test';

  this.create = function (dbName, callback) {
    makeRequest(this, 'PUT', '', null, callback);
  };

  this.get = function (docId, callback) {
    makeRequest(this, 'GET', docId, null, callback);
  };

  this.insert = function (docId, doc, callback) {
    var method = 'PUT';

    if (typeof docId !== 'string') {
      callback = doc;
      doc = docId;
      docId = '';
      method = 'POST';
    }
    makeRequest(this, method, docId, doc, callback);
  };

  this.destroy = function (docId, rev, callback) {
    makeRequest(this, 'DELETE', docId, { "_rev": rev }, callback);
  };

  this.check = function (callback) {
    makeRequest(this, 'GET', '', null, callback);
  };
}

exports.Loveseat = Loveseat;
