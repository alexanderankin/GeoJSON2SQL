var tbl = 'Geometry';

var util = require('./util');

async function insert_(knex, trx, geometry, indexes) {
  var { type } = geometry;
  var mod = require('./util').getModuleFor(geometry.type);

  var { GeoJSON, Feature, GeometryCollection } = indexes || {};
  var data = { type };
  if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Feature)
    data.Feature_id = Feature;
  else if (GeometryCollection)
    data.GeometryCollection_id = GeometryCollection;
  
  var [ Geometry ] = await knex(tbl).transacting(trx).insert(data);

  await mod.insert_(knex, trx, geometry, { Geometry });

  return Geometry;
}

async function insert(knex, geometry) {
  return await knex.transaction(async trx => {
    return await insert_(knex, trx, geometry);
  });
}

module.exports = {
  insert_, insert
};
