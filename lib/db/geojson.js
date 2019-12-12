var tbl = 'GeoJSON';

var util;
process.nextTick(() => { util = require('./util'); });

async function oneAsGeojson(knex, id) {
  var row = await knex('GeoJSON').where({ id }).first();
  if (!row) return null;

  var { type } = row;

  // var GeoJSON = await knex('GeoJSON')
  //   .leftJoin('Feature')
  //   .where({ id }).first();
  if (type === 'MultiPolygon') {
    var mod = util.getModuleFor(type);
    var content = await mod.oneAsGeojson(knex, id);
    return content;
  }

  return {
    type
  };
}

async function insert_(knex, trx, geojson) {
  var { type } = geojson;
  var mod = require('./util').getModuleFor(type);

  var [ GeoJSON ] = await knex(tbl).transacting(trx).insert({ type });
  await mod.insert_(knex, trx, geojson, { GeoJSON });

  return GeoJSON;
}

async function insert(knex, geojson) {
  return await knex.transaction(async trx => {
    return await insert_(knex, trx, geojson);
  });
}

module.exports = {
  oneAsGeojson, insert_, insert
};
