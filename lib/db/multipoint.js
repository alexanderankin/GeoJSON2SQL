var tbl = 'MultiPoint';

var point = require('./point');

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
  var { GeoJSON, Feature, Polygon } = indexes || {};
  var data = {};
  if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Feature)
    data.Feature_id = Feature;
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
  tbl, multipoints, oneAsGeojson, one, insert_, insert
};
