var tbl = 'Feature';

// var util = require('./util');
var geometry = require('./geometry');

async function one(knex, id) {
  return await knex(tbl).select('*').where({ id }).first();
}

/**
 * Must have trx
 */
async function insert_(knex, trx, feature, indexes) {
  var { GeoJSON, FeatureCollection } = indexes || {};
  var data = {};
  if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (FeatureCollection)
    data.FeatureCollection_id = FeatureCollection;

  var [ Feature ] = await knex(tbl).transacting(trx).insert(data);
  // var { properties } = feature;

  if (!feature.geometry)
    return Feature;

  await geometry.insert_(knex, trx, feature.geometry, { Feature });
  return Feature;
}

async function insert(knex, feature) {
  return await knex.transaction(async (trx) => {
    return await insert_(knex, trx, feature);
  });
}

module.exports = {
  one,
  insert,
  insert_,
};
