var feature = require('./feature');
var featurecollection = require('./featurecollection');
var geometry = require('./geometry');
var geometrycollection = require('./geometrycollection');
var linestring = require('./linestring');
var multilinestring = require('./multilinestring');
var multipoint = require('./multipoint');
var multipolygon = require('./multipolygon');
var point = require('./point');
var polygon = require('./polygon');

async function ensureProperties(properties) {
  if (!Array.isArray(properties)) {
    throw new TypeError();
  }

  // knex('properties')
}

function getModuleFor(type) {
  if (!type)
    throw new Error('No Type given');

  var mod = {
    'FeatureCollection': featurecollection,
    'Feature': feature,
    // 'GeoJSON': geojson,
    'GeometryCollection': geometrycollection,
    'Geometry': geometry,
    'LineString': linestring,
    'MultiLineString': multilinestring,
    'MultiPoint': multipoint,
    'MultiPolygon': multipolygon,
    'Point': point,
    'Polygon': polygon
  }[type];

  if (!mod)
    throw new Error('Not Recognized this GeoJSON Geometry: ' + type);

  return mod;
}

module.exports = {
  ensureProperties,
  getModuleFor
};
