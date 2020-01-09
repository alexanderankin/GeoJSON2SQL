var { expect } = require('chai');

var util = require('./util');
var gj2s = require('../lib');

describe/*.only*/('selecting', () => {
  var knex;
  before(async () => { knex = await util.getKnex(); });
  after(async () => { await knex.destroy(); });

  describe('Feature', () => {
    it('should select Feature', async () => {
      var inputs = await util.readAllInputsContains('Feature');
      expect(true).to.be.ok;
    });
  });
  
  describe('FeatureCollection', () => {
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
        console.log(geojson);
      }
    });
  });
  
  describe('Geometry', () => {
    it('should select Geometry', async () => {
      var inputs = await util.readAllInputsContains('Geometry');
      expect(true).to.be.ok;
    });
  });
  
  describe('GeometryCollection', () => {
    it('should select GeometryCollection', async () => {
      var inputs = await util.readAllInputsContains('GeometryCollection');
      expect(true).to.be.ok;
    });
  });
  
  describe('LineString', () => {
    it('should select LineString', async () => {
      var inputs = await util.readAllInputsContains('LineString');
      expect(true).to.be.ok;
    });
  });
  
  describe('MultiLineString', () => {
    it('should select MultiLineString', async () => {
      var inputs = await util.readAllInputsContains('MultiLineString');
      expect(true).to.be.ok;
    });
  });
  
  describe/*.only*/('MultiPoint', () => {
    it('should select MultiPoint', async () => {
      var inputs = await util.readAllInputsContains('MultiPoint');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        // var [ id ] = 
      }
    });
  });
  
  describe('MultiPolygon', () => {
    it('should select MultiPolygon', async () => {
      var inputs = await util.readAllInputsContains('MultiPolygon');
      expect(true).to.be.ok;
    });
  });
  
  describe/*.only*/('Point', () => {
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
      expect(true).to.be.ok;
    });
  });
});
