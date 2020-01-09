var tbl = 'MultiPoint';

var point = require('./point');

async function multipoint(knex, field, id) {
  var mp = await knex(tbl).where({ [field]: id }).first();
  return await point.pointsFor(knex, mp.id, 'MultiPoint_id');
}

async function multipoints(knex, field, id) {
  var multipoints = await knex(tbl).where({ [field]: id });
  return await Promise.all(multipoints.map(ls => {
    return point.pointsFor(knex, ls.id, 'MultiPoint_id');
  }));
}

async function oneAsGeojson(knex, id) {
  var coordinates = await point.pointsFor(knex, id, 'MultiPoint_id');
  return { type: 'MultiPoint', coordinates };
}

async function one(knex, id) {
  // body...
}

async function insert_(knex, trx, multipoint, indexes) {
  var { Feature, GeoJSON, Geometry, Polygon } = indexes || {};
  var data = {};
  if (Feature)
    data.Feature_id = Feature;
  else if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Geometry)
    data.Geometry_id = Geometry;
  else if (Polygon)
    data.Polygon_id = Polygon;

  var [ MultiPoint ] = await knex(tbl).transacting(trx).insert(data);

  var { coordinates } = multipoint;
  for (var i = 0; i < coordinates.length; i++) {
    var coordinate = coordinates[i];
    var pointIndexes = { MultiPoint };
    await point.insert_(knex, trx, { coordinates: coordinate }, pointIndexes);
  }

  return MultiPoint;
}

async function insert(knex, multipoint) {
  return await knex.transaction(async trx => {
    return await insert_(knex, trx, multipoint);
  });
}

module.exports = {
  tbl, single: multipoint, multipoints, oneAsGeojson, one, insert_, insert
};
