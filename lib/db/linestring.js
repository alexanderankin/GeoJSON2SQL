var tbl = 'LineString';

var point = require('./point');

async function insert_(knex, trx, linestring, indexes) {
  var { GeoJSON, Feature, MultiLineString } = indexes || {};
  var data = {};
  if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Feature)
    data.Feature_id = Feature;
  else if (MultiLineString)
    data.MultiLineString_id = MultiLineString;

  var [ LineString ] = await knex(tbl).transacting(trx).insert(data);

  var { coordinates } = linestring;
  for (var i = 0; i < coordinates.length; i++) {
    var coordinate = coordinates[i];
    var pointIndexes = { LineString };
    await point.insert_(knex, trx, { coordinates: coordinate }, pointIndexes);
  }

  return LineString;
}

async function insert(knex, linestring) {
  return await knex.transaction(async trx => {
    return await insert_(knex, trx, linestring);
  });
}

module.exports = {
  insert_, insert
};
