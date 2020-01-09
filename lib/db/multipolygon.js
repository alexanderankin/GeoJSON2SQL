var tbl = 'MultiPolygon';

var polygon = require('./polygon');

async function multipolygon(knex, field, id) {
  var mpg = await knex(tbl).where({ [field]: id }).first();
  return await polygon.polygons(knex, 'MultiPolygon_id', mpg.id);
}

/**
 * @param knex
 * @param id the id of the geojson object which is actually a MultiPolygon
 */
async function oneAsGeojson(knex, id) {
  var coordinates = await polygon.polygons(knex, 'MultiPolygon_id', id);
  return { type: 'MultiPolygon', coordinates };
}

async function insert_(knex, trx, multipolygon, indexes) {
  var { Feature, GeoJSON, Geometry } = indexes || {};
  var data = {};
  if (Feature)
    data.Feature_id = Feature;
  else if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Geometry)
    data.Geometry_id = Geometry;

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
  tbl, single: multipolygon, oneAsGeojson, insert_, insert
};
