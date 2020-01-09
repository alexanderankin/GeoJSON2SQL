var tbl = 'MultiLineString';

var linestring = require('./linestring');

async function multilinestring(knex, field, id) {
  var mls = await knex(tbl).where({ [field]: id }).first();
  if (!mls) {
    console.log(await knex(tbl).select())
    console.log(field, id)
  }
  return await linestring.linestrings(knex, 'MultiLineString_id', mls.id);
}

async function oneAsGeojson(knex, id) {
  var coordinates = await linestring.linestrings(knex, 'MultiLineString_id', id);
  return { type: 'MultiLineString', coordinates };
}

async function insert_(knex, trx, multilinestring, indexes) {
  var { Feature, GeoJSON, Geometry } = indexes || {};
  var data = {};
  if (Feature)
    data.Feature_id = Feature;
  else if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Geometry)
    data.Geometry_id = Geometry;

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
  tbl, single: multilinestring, oneAsGeojson, insert_, insert
};
