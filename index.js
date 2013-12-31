var request = require('request')

exports.Loveseat = Loveseat

function Loveseat(options) {

  if (!(this instanceof Loveseat)) return new Loveseat(options)
  
  options = options || {}
  
  this.settings = {
    url: options.url || 'http://localhost:5984/',
    db: options.db || 'test'
  }

  return this
}

Loveseat.prototype.makeRequest = Loveseat$makeRequest

function Loveseat$makeRequest(method, url, data, callback) {
  var options = {
    url: this.settings.url + this.settings.db + '/' + url,
    method: method
  }

  if (data && (method == 'POST' || method == 'PUT')) options.json = data
  else if (data) options.qs = data

  request(options, onrequest)
    
  function onrequest(err, res, body) {
    if (err) return callback && callback(err)
    if (res.statusCode === 409) {
      return callback && callback(JSON.stringify(body))
    }

    if (callback) {
      callback(null, (options.json || !body.length ? body : JSON.parse(body)))
    }
  })

}

Loveseat.prototype.create = function Loveseat$create(callback) {
  this.makeRequest('PUT', '', null, callback)
}

Loveseat.prototype.get = function Loveseat$get(docId, callback) {
  this.makeRequest('GET', docId, null, callback)
}

Loveseat.prototype.destroy = function Loveseat$destroy(docId, rev, callback) {
  this.makeRequest('DELETE', docId, { rev: rev }, callback)
}

Loveseat.prototype.check = function Loveseat$check(callback) {
  this.makeRequest('HEAD', '', null, callback)
}

Loveseat.prototype.insert = function Loveseat$insert(docId, doc, callback) {
  var method = 'PUT'

  if (typeof docId !== 'string') {
    callback = doc
    doc = docId
    docId = ''
    method = 'POST'
  }

  this.makeRequest(method, docId, doc, callback)
}
