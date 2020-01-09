var tbl = 'LineString';

var point = require('./point');

async function linestring(knex, field, id) {
  var ls = await knex(tbl).where({ [field]: id }).first();
  return point.pointsFor(knex, ls.id, 'LineString_id');
}

async function linestrings(knex, field, id) {
  var linestrings = await knex(tbl).where({ [field]: id });
  return await Promise.all(linestrings.map(ls => {
    return point.pointsFor(knex, ls.id, 'LineString_id');
  }));
}

async function oneAsGeojson(knex, id) {
  var coordinates = await point.pointsFor(knex, id, 'LineString_id');
  return { type: 'LineString', coordinates };
}

async function insert_(knex, trx, linestring, indexes) {
  var { GeoJSON, Geometry, Feature, MultiLineString } = indexes || {};
  var data = {};
  if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Feature)
    data.Feature_id = Feature;
  else if (Geometry)
    data.Geometry_id = Geometry;
  else if (MultiLineString)
    data.MultiLineString_id = MultiLineString;

  var [ LineString ] = await knex(tbl).transacting(trx).insert(data);

  var { coordinates } = linestring;
  for (var i = 0; i < coordinates.length; i++) {
    var coordinate = coordinates[i];
    var pointIndexes = { LineString };
    await point.insert_(knex, trx, { coordinates: coordinate }, pointIndexes);
  }

  return LineString;
}

async function insert(knex, linestring) {
  return await knex.transaction(async trx => {
    return await insert_(knex, trx, linestring);
  });
}

module.exports = {
  tbl,
  single: linestring,
  multiple: linestrings,
  linestrings,
  oneAsGeojson,
  insert_,
  insert
};
