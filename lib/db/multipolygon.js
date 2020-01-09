var tbl = 'MultiPolygon';

var polygon = require('./polygon');

/**
 * @param knex
 * @param id the id of the geojson object which is actually a MultiPolygon
 */
async function oneAsGeojson(knex, id) {
  var coordinates = await polygon.polygons(knex, 'MultiPolygon_id', id);
  return { type: 'MultiPolygon', coordinates };
}

async function insert_(knex, trx, multipolygon, indexes) {
  var { GeoJSON, Feature } = indexes || {};
  var data = {};
  if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Feature)
    data.Feature_id = Feature;

  var [ MultiPolygon ] = await knex(tbl).transacting(trx).insert(data);

  var { coordinates } = multipolygon;
  for (var i = 0; i < coordinates.length; i++) {
    var p = { coordinates: coordinates[i] };
    await polygon.insert_(knex, trx, p, { MultiPolygon });
  }

  return MultiPolygon;
}

async function insert(knex, multipolygon) {
  return await knex.transaction(async trx => {
    return await insert_(knex, trx, multipolygon);
  });
}

module.exports = {
  tbl, oneAsGeojson, insert_, insert
};
