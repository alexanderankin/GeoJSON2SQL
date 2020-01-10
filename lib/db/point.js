var tbl = 'Point';

async function single(knex, id) {
  return {
    type: 'Point',
    coordinates: coords(await knex(tbl).where({ id }))
  };
}

async function pointsFor(knex, id, whichId) {
  var points = await knex(tbl).select('*').where({ [ whichId ]: id });

  return points.map(coords);
}

function coords(row) {
  var { a, b, c } = row;

  var coordinates = [ a, b ];
  if (c)
    coordinates.push(c);

  return coordinates;
}

async function oneAsGeojson(knex, id) {
  var row = await knex(tbl).select('*').where({ id }).first();

  return { type: 'Point', coordinates: coords(row) };
}

async function one(knex, id) {
  return await knex(tbl).select('*').where({ id }).first();
}

/**
 * For reuse
 */
async function insert_(knex, trx, point, indexes) {
  var [ a, b, c ] = point.coordinates;
  c = c || null;
  var data = { a, b, c };

  var { GeoJSON, Feature, LineString, MultiPoint } = indexes || {};
  if (GeoJSON)
    data.GeoJSON_id = GeoJSON;
  else if (Feature)
    data.Feature_id = Feature;
  else if (LineString)
    data.LineString_id = LineString;
  else if (MultiPoint)
    data.MultiPoint_id = MultiPoint;

  var query = knex(tbl);
  query.transacting(trx)

  var [ id ] = await query.insert(data);
  return id;
}

async function insert(knex, point) {
  return await knex.transaction(async (trx) => {
    return await insert_(knex, trx, point);
  });
}

module.exports = {
  tbl,
  single,
  pointsFor,
  oneAsGeojson,
  one,
  insert,
  insert_,
};
