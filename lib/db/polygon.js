var tbl = 'Polygon';

var multipoint = require('./multipoint');
var point = require('./point');

async function polygons(knex, MultiPolygon_id) {
  var polygons = await knex(tbl).where({ MultiPolygon_id });
  return await Promise.all(polygons.map(pg => {
    return multipoint.multipoints(knex, pg.id);
  }));
}

async function oneAsGeojson(knex, id) {
  var coordinates = await multipoint.multipoints(knex, id);
  return { type: 'Polygon', coordinates };
}

async function one(knex, id) {
  // body...
}

async function insert_(knex, trx, polygon, indexes) {
  var { GeoJSON, Feature, MultiPolygon } = indexes || {};
  var data = {};
  if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Feature)
    data.Feature_id = Feature;
  else if (MultiPolygon)
    data.MultiPolygon_id = MultiPolygon;

  var [ Polygon ] = await knex(tbl).transacting(trx).insert(data);

  var { coordinates } = polygon;
  for (var i = 0; i < coordinates.length; i++) {
    var string = coordinates[i];
    var mp = { coordinates: string };
    await multipoint.insert_(knex, trx, mp, { Polygon });
  }

  return Polygon;
}

async function insert(knex, multipoint) {
  return await knex.transaction(async trx => {
    return await insert_(knex, trx, multipoint);
  });
}

module.exports = {
  tbl, polygons, one, oneAsGeojson, insert_, insert
};
