var tbl = 'MultiLineString';

var linestring = require('./linestring');

async function oneAsGeojson(knex, id) {
  var coordinates = await linestring.linestrings(knex, id);
  return { type: 'MultiLineString', coordinates };
}

async function insert_(knex, trx, multilinestring, indexes) {
  var { GeoJSON, Feature } = indexes || {};
  var data = {};
  if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Feature)
    data.Feature_id = Feature;

  var [ MultiLineString ] = await knex(tbl).transacting(trx).insert(data);

  for (var i = 0; i < multilinestring.coordinates.length; i++) {
    var coordinate = multilinestring.coordinates[i];
    var line = { coordinates: coordinate };
    await linestring.insert_(knex, trx, line, { MultiLineString })
  }

  return MultiLineString;
}

async function insert(knex, multilinestring) {
  return await knex.transaction(async trx => {
    return await insert_(knex, trx, multilinestring);
  });
}

module.exports = {
  tbl, oneAsGeojson, insert_, insert
};
