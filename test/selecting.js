var { expect } = require('chai');

var util = require('./util');
var gj2s = require('../lib');

describe.only('selecting', () => {
  var knex;
  before(async () => { knex = await util.getKnex(); });
  after(async () => { await knex.destroy(); });

  describe.skip('Feature', () => {
    it('should select Feature', async () => {
      var inputs = await util.readAllInputsContains('Feature');
      expect(true).to.be.ok;
    });
  });
  
  describe.skip('FeatureCollection', () => {
    it('should select FeatureCollection', async () => {
      var inputs = await util.readAllInputsContains('FeatureCollection');
      expect(true).to.be.ok;
    });
  });
  
  describe.skip('GeoJSON', () => {
    it('should select GeoJSON', async () => {
      var inputs = await util.readAllInputsContains('GeoJSON');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (input.type != 'MultiPolygon')
          continue;
        var id = await gj2s.db.geojson.insert(knex, input);
        var geojson = await gj2s.db.geojson.oneAsGeojson(knex, id);
      }
    });
  });
  
  describe.skip('Geometry', () => {
    it('should select Geometry', async () => {
      var inputs = await util.readAllInputsContains('Geometry');
      expect(true).to.be.ok;
    });
  });
  
  describe.skip('GeometryCollection', () => {
    it('should select GeometryCollection', async () => {
      var inputs = await util.readAllInputsContains('GeometryCollection');
      expect(true).to.be.ok;
    });
  });
  
  describe('LineString', () => {
    it('should select LineString', async () => {
      var inputs = await util.readAllInputsContains('LineString');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var id = await gj2s.db.linestring.insert(knex, input);
        var ls = await gj2s.db.linestring.oneAsGeojson(knex, id);

        input.coordinates = input.coordinates.map(c => c.slice(0, 3));
        expect(ls).to.eql(input);
      }
    });
  });
  
  describe('MultiLineString', () => {
    it('should select MultiLineString', async () => {
      var inputs = await util.readAllInputsContains('MultiLineString');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var id = await gj2s.db.multilinestring.insert(knex, input);
        var ml = await gj2s.db.multilinestring.oneAsGeojson(knex, id);

        input.coordinates = input.coordinates.map(line => {
          return line.map(c => c.slice(0, 3));
        });
        expect(ml).to.eql(input);
      }
    });
  });
  
  describe('MultiPoint', () => {
    it('should select MultiPoint', async () => {
      var inputs = await util.readAllInputsContains('MultiPoint');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var id = await gj2s.db.multipoint.insert(knex, input);
        var mp = await gj2s.db.multipoint.oneAsGeojson(knex, id);
        
        input.coordinates = input.coordinates.map(c => c.slice(0, 3));
        expect(mp).to.eql(input);
      }
    });
  });
  
  describe.only('MultiPolygon', () => {
    it('should select MultiPolygon', async () => {
      var inputs = await util.readAllInputsContains('MultiPolygon');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var id = await gj2s.db.multipolygon.insert(knex, input);
        var mpg = await gj2s.db.multipolygon.oneAsGeojson(knex, id);

        input.coordinates = input.coordinates.map(i => {
          return i.map(j => j.map(k => k.slice(0, 3)))
        });

        expect(mpg).to.eql(input);
      }
    });
  });
  
  describe('Point', () => {
    it('should select Point', async () => {
      var inputs = await util.readAllInputsContains('Point');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var id = await gj2s.db.point.insert(knex, input);
        var point = await gj2s.db.point.oneAsGeojson(knex, id);
        
        input.coordinates = input.coordinates.slice(0, 3);
        expect(point).to.eql(input);
      }
    });
  });
  
  describe('Polygon', () => {
    it('should select Polygon', async () => {
      var inputs = await util.readAllInputsContains('Polygon');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var id = await gj2s.db.polygon.insert(knex, input);
        var pg = await gj2s.db.polygon.oneAsGeojson(knex, id);

        input.coordinates = input.coordinates.map(mp => {
          return mp.map(p => p.slice(0, 3));
        });
        expect(pg).to.eql(input);
      }
    });
  });
});
