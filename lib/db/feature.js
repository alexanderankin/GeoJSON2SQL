var tbl = 'Feature';

// var util = require('./util');
var gm = require('./geometry');

async function features(knex, field, id) {
  var ids = await knex(tbl).where({ [field]: id }).select('id');
  console.log(ids);

  return Promise.all(ids.map(id => id.id).map(id => {
    return oneAsGeojson(knex, id);
  }));
}

async function oneAsGeojson(knex, Feature_id) {
  // TODO properties
  return { type: 'Feature', geometry: await gm.one(knex, 'Feature_id', Feature_id) };
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

  await gm.insert_(knex, trx, geometry, { Feature });
  return Feature;
}

async function insert(knex, feature) {
  return await knex.transaction(async (trx) => {
    return await insert_(knex, trx, feature);
  });
}

module.exports = {
  multiple: features,
  oneAsGeojson,
  one,
  insert,
  insert_,
};
