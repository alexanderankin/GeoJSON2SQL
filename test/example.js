var { expect } = require('chai');

var util = require('./util');
var gj2s = require('../lib');

describe.skip('Example', () => {
  describe('Feature', () => {
    it('should demonstrate how to write a test', async () => {
      var inputs = await util.readAllInputsContains('Feature');
      expect(true).to.be.ok;
    });
  });
  
  describe('FeatureCollection', () => {
    it('should demonstrate how to write a test', async () => {
      var inputs = await util.readAllInputsContains('FeatureCollection');
      expect(true).to.be.ok;
    });
  });
  
  describe('GeoJSON', () => {
    it('should demonstrate how to write a test', async () => {
      var inputs = await util.readAllInputsContains('GeoJSON');
      expect(true).to.be.ok;
    });
  });
  
  describe('Geometry', () => {
    it('should demonstrate how to write a test', async () => {
      var inputs = await util.readAllInputsContains('Geometry');
      expect(true).to.be.ok;
    });
  });
  
  describe('GeometryCollection', () => {
    it('should demonstrate how to write a test', async () => {
      var inputs = await util.readAllInputsContains('GeometryCollection');
      expect(true).to.be.ok;
    });
  });
  
  describe('LineString', () => {
    it('should demonstrate how to write a test', async () => {
      var inputs = await util.readAllInputsContains('LineString');
      expect(true).to.be.ok;
    });
  });
  
  describe('MultiLineString', () => {
    it('should demonstrate how to write a test', async () => {
      var inputs = await util.readAllInputsContains('MultiLineString');
      expect(true).to.be.ok;
    });
  });
  
  describe('MultiPoint', () => {
    it('should demonstrate how to write a test', async () => {
      var inputs = await util.readAllInputsContains('MultiPoint');
      expect(true).to.be.ok;
    });
  });
  
  describe('MultiPolygon', () => {
    it('should demonstrate how to write a test', async () => {
      var inputs = await util.readAllInputsContains('MultiPolygon');
      expect(true).to.be.ok;
    });
  });
  
  describe('Point', () => {
    it('should demonstrate how to write a test', async () => {
      var inputs = await util.readAllInputsContains('Point');
      expect(true).to.be.ok;
    });
  });
  
  describe('Polygon', () => {
    it('should demonstrate how to write a test', async () => {
      var inputs = await util.readAllInputsContains('Polygon');
      expect(true).to.be.ok;
    });
  });
});
