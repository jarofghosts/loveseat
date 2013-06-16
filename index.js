var request = require('request');

function makeRequest(loveseat, method, url, data, callback) {

  var options = {
      url: loveseat.url + loveseat.db + '/' + url,
      method: method
    };

  if (data && method != 'DELETE') { options.json = data; }
  if (data && method == 'DELETE') { options.qs = data; }

  request(options, function (err, res, body) {
    if (err) { return callback && callback(err); }
    if (res.statusCode == 409) {
      callback && callback(JSON.stringify(body));
    } else {
      callback && callback(null, (data && method != 'DELETE' ? body : JSON.parse(body)));
    }
  });

}
function Loveseat(options) {
  
  options = options || {};
  
  this.settings = {
    url: options.url || 'http://localhost:5984/',
    db: options.db || 'test'
  };

  this.create = function (callback) {
    makeRequest(this.settings, 'PUT', '', null, callback);
  };

  this.get = function (docId, callback) {
    makeRequest(this.settings, 'GET', docId, null, callback);
  };

  this.insert = function (docId, doc, callback) {
    var method = 'PUT';

    if (typeof docId !== 'string') {
      callback = doc;
      doc = docId;
      docId = '';
      method = 'POST';
    }
    makeRequest(this.settings, method, docId, doc, callback);
  };

  this.destroy = function (docId, rev, callback) {
    makeRequest(this.settings, 'DELETE', docId, { "rev": rev }, callback);
  };

  this.check = function (callback) {
    makeRequest(this.settings, 'GET', '', null, callback);
  };
}

exports.Loveseat = Loveseat;
