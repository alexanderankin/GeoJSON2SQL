var tbl = 'Feature';

// var util = require('./util');
var geometryFns = require('./geometry');

async function oneAsGeojson(knex, Feature_id) {
  // var geometryFns.

  // return ft;
}

async function one(knex, id) {
  return await knex(tbl).select('*').where({ id }).first();
}

/**
 * Must have trx
 * 
 * feature is:
 * { type: "", properties: {}, geometry: { type, coordinates } }
 */
async function insert_(knex, trx, feature, indexes) {
  var { properties, geometry } = feature;
  var { GeoJSON, FeatureCollection } = indexes || {};

  var data = {};
  if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (FeatureCollection)
    data.FeatureCollection_id = FeatureCollection;

  var [ Feature ] = await knex(tbl).transacting(trx).insert(data);

  if (!geometry)
    return Feature;

  await geometryFns.insert_(knex, trx, geometry, { Feature });
  return Feature;
}

async function insert(knex, feature) {
  return await knex.transaction(async (trx) => {
    return await insert_(knex, trx, feature);
  });
}

module.exports = {
  one,
  oneAsGeojson,
  insert,
  insert_,
};
