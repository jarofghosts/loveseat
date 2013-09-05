var request = require('request');

function Loveseat(options) {

  if (!(this instanceof Loveseat)) return new Loveseat(options);
  
  options = options || {};
  
  this.settings = {
    url: options.url || 'http://localhost:5984/',
    db: options.db || 'test'
  };

  return this;
}

Loveseat.prototype.makeRequest = function (method, url, data, callback) {

  var options = {
    url: this.settings.url + this.settings.db + '/' + url,
    method: method
  };

  if (data && method != 'DELETE' && method != 'GET') options.json = data;
  else if (data) options.qs = data;

  request(options, function (err, res, body) {
    if (err) return callback && callback(err);
    if (res.statusCode == 409) return callback && callback(JSON.stringify(body));
    callback && callback(null, (options.json ? body : JSON.parse(body)));
  });

};

Loveseat.prototype.create = function (callback) {
  this.makeRequest('PUT', '', null, callback);
};

Loveseat.prototype.get = function (docId, callback) {
  this.makeRequest('GET', docId, null, callback);
};

Loveseat.prototype.destroy = function (docId, rev, callback) {
  this.makeRequest('DELETE', docId, { rev: rev }, callback);
};

Loveseat.prototype.check = function (callback) {
  this.makeRequest('HEAD', '', null, callback);
};

Loveseat.prototype.insert = function (docId, doc, callback) {
  var method = 'PUT';

  if (typeof docId !== 'string') {
    callback = doc;
    doc = docId;
    docId = '';
    method = 'POST';
  }
  this.makeRequest(method, docId, doc, callback);
};

exports.Loveseat = Loveseat;
