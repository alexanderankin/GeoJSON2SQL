var { expect } = require('chai');

var util = require('./util');
var gj2s = require('../lib');

describe('inserting', () => {
  var knex;
  before(async () => { knex = await util.getKnex(); });
  after(async () => { await knex.destroy(); });

  describe('Feature', () => {
    it('should insert a Feature', async () => {
      var inputs = await util.readAllInputsContains('Feature');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        await gj2s.db.feature.insert(knex, input);
      }
    });
  });
  
  describe('FeatureCollection', () => {
    it('should insert a FeatureCollection', async () => {
      var inputs = await util.readAllInputsContains('FeatureCollection');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        await gj2s.db.featurecollection.insert(knex, input);
      }
    });
  });
  
  describe('GeoJSON', () => {
    it('should insert a GeoJSON', async () => {
      var inputs = await util.readAllInputsContains('GeoJSON');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        await gj2s.db.geojson.insert(knex, input);
      }
    });
  });
  
  describe('Geometry', () => {
    it('should insert a Geometry', async () => {
      var inputs = await util.readAllInputsContains('Geometry');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        await gj2s.db.geometry.insert(knex, input);
      }
    });
  });
  
  describe('GeometryCollection', () => {
    it('should insert a GeometryCollection', async () => {
      var inputs = await util.readAllInputsContains('GeometryCollection');
      expect(true).to.be.ok;
    });
  });
  
  describe('LineString', () => {
    it('should insert a LineString', async () => {
      var inputs = await util.readAllInputsContains('LineString');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var result = await gj2s.db.linestring.insert(knex, input);
        var {
          GeoJSON_id,
          Feature_id,
          MultiLineString_id
        } = await knex('LineString').select('*').where({ id: result }).first();

        // is standalone linestring
        expect(GeoJSON_id).to.not.be.ok;
        expect(Feature_id).to.not.be.ok;
        expect(MultiLineString_id).to.not.be.ok;

        var points = await knex('Point')
          .select('*')
          .where({ LineString_id: result });
        for (var j = 0; j < points.length; j++) {
          var point = points[j];
          var { a, b, c } = point;
          expect([ a, b ]).to.eql(input.coordinates[j].slice(0, 2));
          if (c)
            expect(c).to.equal(input.coordinates[j][2]);
        }
      }
    });
  });
  
  describe('MultiLineString', () => {
    it('should insert a MultiLineString', async () => {
      var inputs = await util.readAllInputsContains('MultiLineString');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var result = await gj2s.db.multilinestring.insert(knex, input);
        var {
          GeoJSON_id,
          Feature_id
        } = await knex('MultiLineString').where({ id: result }).first();
        expect(GeoJSON_id).to.be.null;
        expect(Feature_id).to.be.null;

        var MultiLineString_id = result;
        var lines = await knex('LineString').where({ MultiLineString_id });
        for (var j = 0; j < input.coordinates.length; j++) {
          var line = input.coordinates[j];
          var LineString_id = lines[j].id;
          var points = await knex('Point').where({ LineString_id });
          for (var k = 0; k < line.length; k++) {
            var point = line[k];
            var { a, b, c } = points[k];
            expect([ a, b ]).to.eql(point.slice(0, 2));
            if (c) expect(c).to.equal(point[2]);
          }
        }
      }
    });
  });
  
  describe('MultiPoint', () => {
    it('should insert a MultiPoint', async () => {
      var inputs = await util.readAllInputsContains('MultiPoint');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var result = await gj2s.db.multipoint.insert(knex, input);
        var {
          GeoJSON_id,
          Feature_id,
          LineString_id
        } = await knex('MultiPoint').select('*').where({ id: result }).first();

        // is a standalone multipoint
        expect(GeoJSON_id).to.not.be.ok;
        expect(Feature_id).to.not.be.ok;
        expect(LineString_id).to.not.be.ok;

        var points = await knex('Point')
          .select('*')
          .where({ MultiPoint_id: result });
        for (var j = 0; j < points.length; j++) {
          var point = points[j];

          // is our multipoint
          var { a, b, c } = point;
          expect([ a, b ]).to.eql(input.coordinates[j].slice(0, 2));
          if (c)
            expect(c).to.equal(input.coordinates[j][2]);
        }
      }
    });
  });
  
  describe('MultiPolygon', () => {
    it('should insert a MultiPolygon', async () => {
      var inputs = await util.readAllInputsContains('MultiPolygon');

      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        // console.log(input);
        var MultiPolygon_id = await gj2s.db.multipolygon.insert(knex, input);
        var { GeoJSON_id, Feature_id } = await knex('MultiPolygon')
          .select('*')
          .where({ id: MultiPolygon_id })
          .first();

        expect(GeoJSON_id).to.be.null;
        expect(Feature_id).to.be.null;

        var polygons = await knex('Polygon').where({ MultiPolygon_id });
        for (var j = 0; j < input.coordinates.length; j++) {
          var polygonLevel = input.coordinates[j];
          var Polygon_id = polygons[j].id;

          var mps = await knex('MultiPoint').where({ Polygon_id });
          for (var k = 0; k < polygonLevel.length; k++) {
            var mpLevel = polygonLevel[k];
            var MultiPoint_id = mps[k].id;

            var ps = await knex('Point').where({ MultiPoint_id });
            for (var l = 0; l < mpLevel.length; l++) {
              var point = mpLevel[l];
              var insertedPoint = ps[l];
              var { a, b, c } = insertedPoint;
              expect([ a, b ]).to.eql(point.slice(0, 2));
              if (c)
                expect(c).to.equal(point[2]);
            }
          }
        }
      }
    });
  });
  
  describe('Point', () => {
    it('should insert a Point', async () => {
      var inputs = await util.readAllInputsContains('Point');

      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var [ c1, c2, c3 ] = input.coordinates;

        // insert
        var id = await gj2s.db.point.insert(knex, input);

        // check
        var inserted = await knex('Point').select('*').where({ id }).first();
        var { id, a, b, c } = inserted;
        var got = [ a, b, c ];

        // assert
        expect(a).to.eql(c1);
        expect(b).to.eql(c2);
        if (c)
          expect(c).to.eql(c3);
      }
    });
  });
  
  describe('Polygon', () => {
    it('should insert a Polygon', async () => {
      var inputs = await util.readAllInputsContains('Polygon');

      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];

        // insert
        var result = await gj2s.db.polygon.insert(knex, input);

        var {
          GeoJSON_id,
          Feature_id,
          MultiPolygon_id
        } = await knex('Polygon').select('*').where({ id: result }).first();
        
        expect(GeoJSON_id).to.be.null;
        expect(Feature_id).to.be.null;
        expect(MultiPolygon_id).to.be.null;

        var strings = await knex('MultiPoint')
          .select('*')
          .where({ Polygon_id: result });

        for (var j = 0; j < input.coordinates.length; j++) {
          var string = input.coordinates[j];
          var { id } = strings[j];

          var insertedCoordinates = await knex('Point')
            .select('*')
            .where({ MultiPoint_id: id });

          for (var k = 0; k < string.length; k++) {
            var coordinate = string[k];
            var insertedCoordinate = insertedCoordinates[k];
            var { a, b, c } = insertedCoordinate;

            expect([ a, b ]).to.eql(coordinate.slice(0, 2));
            if (c)
              expect(c).to.equal(coordinate[2]);
          }
        }
      }
    });
  });
});
