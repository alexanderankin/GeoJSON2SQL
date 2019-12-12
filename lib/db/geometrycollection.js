var tbl = 'GeometryCollection';

var geometry = require('./geometry');

async function insert_(knex, trx, geometrycollection, indexes) {
  var { GeoJSON, Feature } = indexes || {};
  var data = {};
  if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Feature)
    data.Feature_id = Feature;

  var [ GeometryCollection ] = await knex(tbl).transacting(trx).insert(data);

  var { geometries } = geometrycollection;
  for (var i = 0; i < geometries.length; i++) {
    var thisGeometry = geometries[i];
    await geometry.insert_(knex, trx, thisGeometry, { GeometryCollection });
  }

  return GeometryCollection;
}

async function insert(knex, geometrycollection) {
  return await knex.transaction(async trx => {
    return await insert_(knex, trx, geometrycollection);
  });
}

module.exports = {
  insert_, insert
};
