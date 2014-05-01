var request = require('request')

exports.Loveseat = Loveseat

function Loveseat(options) {
  if(!(this instanceof Loveseat)) return new Loveseat(options)
  
  options = options || {}
  
  this.settings = {
      url: options.url || 'http://localhost:5984/'
    , db: options.db || 'test'
  }

  return this
}

Loveseat.prototype.makeRequest = Loveseat$make_request

function Loveseat$make_request(method, url, data, callback) {
  var options = {
    url: this.settings.url + this.settings.db + '/' + url,
    method: method
  }

  if(data && (method == 'POST' || method == 'PUT')) options.json = data
  else if(data) options.qs = data

  request(options, onrequest)
    
  function onrequest(err, res, body) {
    if(err) return callback && callback(err)
    if(res.statusCode === 409) {
      return callback && callback(JSON.stringify(body))
    }

    if(callback) {
      callback(null, (options.json || !body.length ? body : JSON.parse(body)))
    }
  }
}

Loveseat.prototype.create = function Loveseat$create(callback) {
  this.make_request('PUT', '', null, callback)
}

Loveseat.prototype.get = function Loveseat$get(doc_id, callback) {
  this.make_request('GET', doc_id, null, callback)
}

Loveseat.prototype.destroy = function Loveseat$destroy(doc_id, rev, callback) {
  this.make_request('DELETE', doc_id, { rev: rev }, callback)
}

Loveseat.prototype.check = function Loveseat$check(callback) {
  this.make_request('HEAD', '', null, callback)
}

Loveseat.prototype.insert = function Loveseat$insert(doc_id, doc, callback) {
  var method = 'PUT'

  if(typeof doc_id !== 'string') {
    callback = doc
    doc = doc_id
    doc_id = ''
    method = 'POST'
  }

  this.make_request(method, doc_id, doc, callback)
}
