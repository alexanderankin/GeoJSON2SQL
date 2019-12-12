var tbl = 'MultiPolygon';

var polygon = require('./polygon');

var oneAsGeojsonJoinFields = [
];

/**
 * @param knex
 * @param id the id of the geojson object which is actually a MultiPolygon
 */
async function oneAsGeojson(knex, id) {
  var PolygonTbl = require('./util').getModuleFor('Polygon').tbl;
  var MultiPointTbl = require('./util').getModuleFor('MultiPoint').tbl;
  var PointTbl = require('./util').getModuleFor('Point').tbl;

  var where = {}; where[tbl + '.GeoJSON_id'] = id;
  var query = knex(tbl)
    .select(/*oneAsGeojsonJoinFields*/)
    .leftJoin(PolygonTbl, tbl + '.id', PolygonTbl + '.MultiPolygon_id')
    .leftJoin(MultiPointTbl, PolygonTbl + '.id', MultiPointTbl + '.Polygon_id')
    .leftJoin(PointTbl, MultiPointTbl + '.id', PointTbl + '.MultiPoint_id')
    .where(where);

  // console.log(query.toString());
  var rows = await query;

  var whichPolygon = rows[0][PolygonTbl + '_id'];
  var polygons = [];
  var currentPolygon = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var polygonId = row[PolygonTbl + '_id'];
    console.log(polygonId, whichPolygon);

    if (polygonId !== whichPolygon) {
      polygons.push(currentPolygon);
      currentPolygon = [];
    }

    // currentPolygon.push()
    // var 
  }

  return rows;
}

async function insert_(knex, trx, multipolygon, indexes) {
  var { GeoJSON, Feature } = indexes || {};
  var data = {};
  if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Feature)
    data.Feature_id = Feature;

  var [ MultiPolygon ] = await knex(tbl).transacting(trx).insert(data);

  var { coordinates } = multipolygon;
  for (var i = 0; i < coordinates.length; i++) {
    var p = { coordinates: coordinates[i] };
    await polygon.insert_(knex, trx, p, { MultiPolygon });
  }

  return MultiPolygon;
}

async function insert(knex, multipolygon) {
  return await knex.transaction(async trx => {
    return await insert_(knex, trx, multipolygon);
  });
}

module.exports = {
  tbl, oneAsGeojson, insert_, insert
};
