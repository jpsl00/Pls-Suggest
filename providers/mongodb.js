// Copyright (c) 2017-2018 dirigeants. All rights reserved.
/*
MIT license.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const { Provider, util: /* {  mergeDefault, */ { mergeObjects, isObject } } = require('klasa')
const { MongoClient: Mongo } = require('mongodb')

module.exports = class extends Provider {
  constructor (...args) {
    super(...args, { description: 'Allows use of MongoDB functionality throughout Klasa' })
    this.db = null
  }

  async init () {
    /* const connection = mergeDefault({
      host: 'localhost',
      port: 27017,
      db: 'klasa',
      options: {}
    }, this.client.options.providers.mongodb) */
    const mongoClient = await Mongo.connect(
      this.client.options.providers.mongodb.connectionURI, /* || `mongodb://${connection.user}:${connection.password}@${connection.host}:${connection.port}/${connection.db}`,
      mergeObjects(connection.options, */ { useNewUrlParser: true })// )
    this.db = mongoClient.db(this.client.options.providers.mongodb.db)
  }

  /* Table methods */

  get exec () {
    return this.db
  }

  hasTable (table) {
    return this.db.listCollections().toArray().then(collections => collections.some(col => col.name === table))
  }

  createTable (table) {
    return this.db.createCollection(table)
  }

  deleteTable (table) {
    return this.db.dropCollection(table)
  }

  /* Document methods */

  getAll (table, filter = []) {
    if (filter.length) return this.db.collection(table).find({ id: { $in: filter } }, { _id: 0 }).toArray()
    return this.db.collection(table).find({}, { _id: 0 }).toArray()
  }

  getKeys (table) {
    return this.db.collection(table).find({}, { id: 1, _id: 0 }).toArray()
  }

  get (table, id) {
    return this.db.collection(table).findOne(resolveQuery(id))
  }

  has (table, id) {
    return this.get(table, id).then(Boolean)
  }

  getRandom (table) {
    return this.db.collection(table).aggregate({ $sample: { size: 1 } })
  }

  create (table, id, doc = {}) {
    return this.db.collection(table).insertOne(mergeObjects(this.parseUpdateInput(doc), resolveQuery(id)))
  }

  delete (table, id) {
    return this.db.collection(table).deleteOne(resolveQuery(id))
  }

  update (table, id, doc) {
    return this.db.collection(table).updateOne(resolveQuery(id), { $set: isObject(doc) ? flatten(doc) : parseEngineInput(doc) })
  }

  replace (table, id, doc) {
    return this.db.collection(table).replaceOne(resolveQuery(id), this.parseUpdateInput(doc))
  }
}

const resolveQuery = query => isObject(query) ? query : { id: query }

function flatten (obj, path = '') {
  let output = {}
  for (const [key, value] of Object.entries(obj)) {
    if (isObject(value)) output = Object.assign(output, flatten(value, path ? `${path}.${key}` : key))
    else output[path ? `${path}.${key}` : key] = value
  }
  return output
}

function parseEngineInput (updated) {
  return Object.assign({}, ...updated.map(entry => ({ [entry.data[0]]: entry.data[1] })))
}
