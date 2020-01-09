var fs = require('fs');
var path = require('path');
var Knex = require('knex');

var schema = require('../lib/schema');
var { up, down } = schema;

async function getKnex() {
  var knex = Knex({
    client: 'sqlite3',
    connection: ':memory:',
    pool: {
      min: 1,
      max: 1,
      // disposeTimeout: 360000*1000,
      idleTimeoutMillis: 360000*1000
    },
    useNullAsDefault: true
  });
  knex.on('query', function (data) {
    // console.log(knex.raw(data.sql, data.bindings).toString());
  })
  await up(knex);
  return knex;
}

async function readAllInputsContains(type) {
  return new Promise(async (res, rej) => {
    var fixtures = path.join(__dirname, 'fixtures');
    fs.readdir(fixtures, async (err, names) => {
      names = names.filter(name => name.startsWith(type + '.json'));
      if (err) return rej(err);

      var inputs = await Promise.all(names.map(async name => {
        return new Promise((resolve, reject) => {
          fs.readFile(path.join(fixtures, name), (err, data) => {
            if (err) return reject(err);

            resolve(JSON.parse(data));
          });
        });
      }));

      res(inputs);
    });
  });
}

module.exports = {
  getKnex,
  readAllInputsContains
};
