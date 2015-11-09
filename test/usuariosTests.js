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

describe('Tests del modelo Usuario --------------', function() {
  it('Test GET usuarios devuelve todos los usuarios', function(done) {
    supertest(app)
      .get('/api/usuarios')
      .expect(200)
      .end(done);
  });

  it('Test GET random falla', function(done) {
    supertest(app)
      .get('/api/usuarios/random')
      .expect(404)
      .end(done);
  });

  it('Test POST usuarios que crea un nuevo usuario', function(done) {
    var usuario = {nombre: 'ohyeah'};
    supertest(app)
      .post('/api/usuarios')
      .send(usuario)
      .expect(201)
      .end(done);
  });

  it('Test GET un usuario por id', function(done) {
    models.Usuario.findAll().then(function(results) {
      var id = results[results.length - 1].id;
      supertest(app)
        .get('/api/usuarios/' + id)
        .expect(200)
        .expect(function(result) {
          assert(result.text.indexOf('ohyeah') != -1);
        })
        .end(done);
    });
  });

  it('Test Put update que modifica un usuario', function(done) {
    var usuarioMod = {nombre: 'ohyeahmodificado'}
    models.Usuario.findAll().then(function(results) {
      var id = results[results.length - 1].id;
      supertest(app)
        .put('/api/usuarios/' + id)
        .send(usuarioMod)
        .expect(204)
        .end(done);
    });
  });

  it('Test Delete que borra un usuario por id en el cuerpo', function(done) {
    models.Usuario.findAll().then(function(results) {
      var idu = results[results.length - 1].id;
      var cuerpo = {id: idu};
      supertest(app)
        .delete('/api/usuarios')
        .send(cuerpo)
        .expect(204)
        .end(done);
    });
  });

  it('Test GET noticias de usuario', function(done) {
    models.Usuario.findAll().then(function(results) {
      var usuario = {nombre: 'ohyeah'};
      supertest(app)
        .post('/api/usuarios')
        .send(usuario)
        .expect(201);

      var id = results[results.length - 1].id;
      supertest(app)
        .get('/api/usuarios/' + id + '/noticias')
        .expect(200)
        .end(done);
    });
  });

});
