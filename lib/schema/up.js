async function up(knex) {
  await tables(knex);
  await constraints(knex);
}

async function tables(knex) {
  // property map
  await knex.schema.createTable('property', t => {
    t.increments();
    t.string('name');
    t.string('description');
  });

  await knex.schema.createTable('value', t => {
    t.increments();
    t.integer('property_id').unsigned();
    t.integer('Feature_id').unsigned();
    t.string('value');
  });

  // internal
  await knex.schema.createTable('GeoJSON', t => {
    t.increments();
    t.string('type', 20);
  });

  // entities
  await knex.schema.createTable('Feature', t => {
    t.increments();
    t.integer('GeoJSON_id').unsigned();
    t.integer('FeatureCollection_id').unsigned();
    t.string('type', 20);
  });

  await knex.schema.createTable('FeatureCollection', t => {
    t.increments();
    t.integer('GeoJSON_id').unsigned();
  });

  await knex.schema.createTable('Geometry', t => {
    t.increments();
    t.integer('GeoJSON_id').unsigned();
    t.integer('Feature_id').unsigned();
    t.integer('GeometryCollection_id').unsigned();
    t.string('type', 20);
  });

  await knex.schema.createTable('GeometryCollection', t => {
    t.increments();
    t.integer('GeoJSON_id').unsigned();
    t.integer('Feature_id').unsigned();
  });

  await knex.schema.createTable('LineString', t => {
    t.increments();
    t.integer('GeoJSON_id').unsigned();
    t.integer('Feature_id').unsigned();
    t.integer('MultiLineString_id').unsigned();
  });

  await knex.schema.createTable('MultiLineString', t => {
    t.increments();
    t.integer('GeoJSON_id').unsigned();
    t.integer('Feature_id').unsigned();
  });

  await knex.schema.createTable('Point', t => {
    t.increments();
    t.integer('GeoJSON_id').unsigned();
    t.integer('Feature_id').unsigned();
    t.integer('LineString_id').unsigned();
    t.integer('MultiPoint_id').unsigned();

    t.decimal('a', 8, 3);
    t.decimal('b', 8, 3);
    t.decimal('c', 8, 3);
  });

  await knex.schema.createTable('MultiPoint', t => {
    t.increments();
    t.integer('GeoJSON_id').unsigned();
    t.integer('Feature_id').unsigned();
    t.integer('Polygon_id').unsigned();
  });

  await knex.schema.createTable('Polygon', t => {
    t.increments();
    t.integer('GeoJSON_id').unsigned();
    t.integer('Feature_id').unsigned();
    t.integer('MultiPolygon_id').unsigned();
  });

  await knex.schema.createTable('MultiPolygon', t => {
    t.increments();
    t.integer('GeoJSON_id').unsigned();
    t.integer('Feature_id').unsigned();
  });
}

async function constraints(knex) {
  if (knex._context.client.config.client === 'sqlite3')
    return;

  await knex.schema.alterTable('value', t => {
    t.foreign('property_id').references('property.id');
    t.foreign('Feature_id').references('Feature.id');
  });

  await knex.schema.alterTable('Feature', t => {
    t.foreign('GeoJSON_id').references('GeoJSON.id');
    t.foreign('FeatureCollection_id').references('FeatureCollection.id');
  });

  await knex.schema.alterTable('FeatureCollection', t => {
    t.foreign('GeoJSON_id').references('GeoJSON.id');
  });

  await knex.schema.alterTable('Geometry', t => {
    t.foreign('GeoJSON_id').references('GeoJSON.id');
    t.foreign('Feature_id').references('Feature.id');
    t.foreign('GeometryCollection_id').references('GeometryCollection.id');
  });

  await knex.schema.alterTable('GeometryCollection', t => {
    t.foreign('GeoJSON_id').references('GeoJSON.id');
    t.foreign('Feature_id').references('Feature.id');
  });

  await knex.schema.alterTable('LineString', t => {
    t.foreign('GeoJSON_id').references('GeoJSON.id');
    t.foreign('Feature_id').references('Feature.id');
    t.foreign('MultiLineString_id').references('MultiLineString.id');
  });

  await knex.schema.alterTable('MultiLineString', t => {
    t.foreign('GeoJSON_id').references('GeoJSON.id');
    t.foreign('Feature_id').references('Feature.id');
  });

  await knex.schema.alterTable('Point', t => {
    t.foreign('GeoJSON_id').references('GeoJSON.id');
    t.foreign('Feature_id').references('Feature.id');
    t.foreign('LineString_id').references('LineString.id');
    t.foreign('MultiPoint_id').references('MultiPoint.id');
  });

  await knex.schema.alterTable('MultiPoint', t => {
    t.foreign('GeoJSON_id').references('GeoJSON.id');
    t.foreign('Feature_id').references('Feature.id');
  });

  await knex.schema.alterTable('Polygon', t => {
    t.foreign('GeoJSON_id').references('GeoJSON.id');
    t.foreign('Feature_id').references('Feature.id');
    t.foreign('MultiPolygon_id').references('MultiPolygon.id');
  });

  await knex.schema.alterTable('MultiPolygon', t => {
    t.foreign('GeoJSON_id').references('GeoJSON.id');
    t.foreign('Feature_id').references('Feature.id');
  });
}

module.exports = up;
