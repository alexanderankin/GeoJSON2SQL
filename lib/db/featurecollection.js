var tbl = 'FeatureCollection';

var feature = require('./feature');
var util = require('./util');

async function oneAsGeojson(knex, id) {
  var features = await feature.multiple(knex, 'FeatureCollection_id', id);
  return { type: 'FeatureCollection', features };
}

async function one(knex, id) {
  return await knex(tbl).select('*').where({ id }).first();
}

/**
 * Must have trx
 */
async function insert_(knex, trx, featurecollection, indexes) {
  var data = { GeoJSON_id: indexes ? indexes.GeoJSON : undefined };

  var [ FeatureCollection ] = await knex(tbl).transacting(trx).insert(data);
  var { features } = featurecollection;

  for (var i = 0; i < features.length; i++) {
    var thisFeature = features[i];
    await feature.insert_(knex, trx, thisFeature, { FeatureCollection })
  }
  
  return FeatureCollection;
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
