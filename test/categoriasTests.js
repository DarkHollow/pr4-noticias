var app = require('../app');
var models  = require('../models');
var supertest = require('supertest');
var assert = require('assert');

/*before('Limpiamos base de datos para los tests', function() {
  models.Noticia.destroy({
    where: {}
  }).then(function() {
    models.Categoria.destroy({
      where: {}
    }).then(function() {
      models.Usuario.destroy({
        where: {}
      });
    });
  });
});*/

describe('Tests del modelo Categoria --------------', function() {
  it('Test GET categorias devuelve todas las categorias', function(done) {
    supertest(app)
      .get('/api/categorias')
      .expect(200)
      .end(done);
  });

  it('Test GET random falla', function(done) {
    supertest(app)
      .get('/api/categorias/random')
      .expect(404)
      .end(done);
  });

  it('Test POST categorias que crea una nueva categoria', function(done) {
    var categoria = {nombre: 'ohyeah'};
    supertest(app)
      .post('/api/categorias')
      .send(categoria)
      .expect(201)
      .end(done);
  });

  it('Test GET una categoria por id', function(done) {
    models.Categoria.findAll().then(function(results) {
      var id = results[results.length - 1].id;
      supertest(app)
        .get('/api/categorias/' + id)
        .expect(200)
        .expect(function(result) {
          assert(result.text.indexOf('ohyeah') != -1);
        })
        .end(done);
    });
  });

  it('Test Put update que modifica una categoria', function(done) {
    var categoriaMod = {nombre: 'ohyeahmodificado'}
    models.Categoria.findAll().then(function(results) {
      var id = results[results.length - 1].id;
      supertest(app)
        .put('/api/categorias/' + id)
        .send(categoriaMod)
        .expect(204)
        .end(done);
    });
  });

  it('Test Delete que borra una categoria por id en el cuerpo', function(done) {
    models.Categoria.findAll().then(function(results) {
      var idu = results[results.length - 1].id;
      var cuerpo = {id: idu};
      supertest(app)
        .delete('/api/categorias')
        .send(cuerpo)
        .expect(204)
        .end(done);
    });
  });

  it('Test GET noticias de una categoria', function(done) {
    var categoria = {nombre: 'ohyeah'};
    supertest(app)
      .post('/api/categorias')
      .send(categoria)
      .expect(201);

    models.Categoria.findAll().then(function(results) {
      var id = results[results.length - 1].id;
      supertest(app)
        .get('/api/categorias/' + id + '/noticias')
        .expect(200)
        .end(done);
    });
  });

});
