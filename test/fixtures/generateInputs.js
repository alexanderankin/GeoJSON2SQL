var fs = require('fs');
var path = require('path');

var faker = require('json-schema-faker');
var md5 = require('md5');

function readdir(p) {
  return new Promise((r, rj) => fs.readdir(p, (e, d) => { if (e) rj(e); else r(d); }));
}

function read(p) {
  return new Promise((r, rj) => fs.readFile(p, 'utf8', (e, d) => { if (e) rj(e); else r(d); }));
}

function write(p, c) {
  return new Promise((r, rj) => fs.writeFile(p, c, 'utf8', (e, d) => { if (e) rj(e); else r(d); }));
}

var schemaDir = path.join(__dirname, '..', '..', '..', 'schema', 'build');

async function deleteAllGeoJSON() {
  var geojsons = (await readdir(__dirname)).filter(e => e.endsWith('.geojson'));
  geojsons = geojsons.map(g => path.join(__dirname, g));
  await Promise.all(geojsons.map(g => new Promise((r, rj) => fs.unlink(g, e => e ? rj(e): r()))));
}

async function main() {
  await deleteAllGeoJSON();
  var schemaPaths = (await readdir(schemaDir)).map(d => path.join(schemaDir, d));
  console.log(schemaPaths);

  var schemas = await Promise.all(schemaPaths.map(async schemaPath => {
    return {
      name: path.basename(schemaPath),
      schema: JSON.parse(await read(schemaPath))
    }
  }));
  
  var hash = md5(new Date());

  var length = schemas.length;
  for (var i = 0; i < length; i++) {
    var schema = schemas[i];
    for (var j = 0; j < 10; j++) {
      var schemaPath = schema.name + '-' + hash + '-' + j + '.geojson';
      var stringified = JSON.stringify(faker.generate(schema).schema);
      await write(path.join(__dirname, schemaPath), stringified);
    }
  }
}

main();
