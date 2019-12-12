async function down(knex) {
  await constraints(knex);
  await tables(knex);
}

async function tables(knex) {
  await knex.schema.dropTable('property');
  await knex.schema.dropTable('value');
  await knex.schema.dropTable('GeoJSON');
  await knex.schema.dropTable('Feature');
  await knex.schema.dropTable('FeatureCollection');
  await knex.schema.dropTable('Geometry');
  await knex.schema.dropTable('GeometryCollection');
  await knex.schema.dropTable('LineString');
  await knex.schema.dropTable('MultiLineString');
  await knex.schema.dropTable('Point');
  await knex.schema.dropTable('MultiPoint');
  await knex.schema.dropTable('Polygon');
  await knex.schema.dropTable('MultiPolygon');
}
    
async function constraints(knex) {
  if (knex._context.client.config.client === 'sqlite3')
    return;

  await knex.schema.alterTable('value', t => {
    t.dropForeign('property_id');
    t.dropForeign('Feature_id');
  });

  await knex.schema.alterTable('Feature', t => {
    t.dropForeign('GeoJSON_id');
    t.dropForeign('FeatureCollection_id');
  });

  await knex.schema.alterTable('FeatureCollection', t => {
    t.dropForeign('GeoJSON_id');
  });

  await knex.schema.alterTable('Geometry', t => {
    t.dropForeign('GeoJSON_id');
    t.dropForeign('Feature_id');
    t.dropForeign('GeometryCollection_id');
  });

  await knex.schema.alterTable('GeometryCollection', t => {
    t.dropForeign('GeoJSON_id');
    t.dropForeign('Feature_id');
  });

  await knex.schema.alterTable('LineString', t => {
    t.dropForeign('GeoJSON_id');
    t.dropForeign('Feature_id');
    t.dropForeign('MultiLineString_id');
  });

  await knex.schema.alterTable('MultiLineString', t => {
    t.dropForeign('GeoJSON_id');
    t.dropForeign('Feature_id');
  });

  await knex.schema.alterTable('Point', t => {
    t.dropForeign('GeoJSON_id');
    t.dropForeign('Feature_id');
    t.dropForeign('LineString_id');
    t.dropForeign('MultiPoint_id');
  });

  await knex.schema.alterTable('MultiPoint', t => {
    t.dropForeign('GeoJSON_id');
    t.dropForeign('Feature_id');
  });

  await knex.schema.alterTable('Polygon', t => {
    t.dropForeign('GeoJSON_id');
    t.dropForeign('Feature_id');
    t.dropForeign('MultiPolygon_id');
  });

  await knex.schema.alterTable('MultiPolygon', t => {
    t.dropForeign('GeoJSON_id');
    t.dropForeign('Feature_id');
  });
}

module.exports = down;
