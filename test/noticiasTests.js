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
var noticia;

describe('Tests del modelo Noticia --------------', function() {
  it('Test GET noticias devuelve todas las noticias', function(done) {
    supertest(app)
      .get('/api/noticias')
      .expect(200)
      .end(done);
  });

  it('Test GET random falla', function(done) {
    supertest(app)
      .get('/api/noticias/random')
      .expect(404)
      .end(done);
  });

  it('Test POST noticias que crea una nueva noticia', function(done) {
    models.Usuario.create({nombre: 'roberto'}).then(function(result) {
      models.Categoria.create({nombre: 'telefonia'}).then(function(result2) {
        models.Usuario.findAll().then(function(usuarios) {
          models.Categoria.findAll().then(function(categorias) {
              var idU = usuarios[usuarios.length - 1].id;
              var idC = categorias[categorias.length - 1].id;
              noticia = {titulo: 'ohyeah', fecha: '2015-10-18', cuerpo: 'ohyeahcuerpo', UsuarioId: idU, CategoriaId: idC};
              supertest(app)
                .post('/api/noticias')
                .send(noticia)
                .expect(201)
                .end(done);
          });
        });
      });
    });
  });

  it('Test GET una noticia por id', function(done) {
    models.Noticia.findAll().then(function(results) {
      var id = results[results.length - 1].id;
      supertest(app)
        .get('/api/noticias/' + id)
        .expect(200)
        .expect(function(result) {
          assert(result.text.indexOf('ohyeah') != -1);
        })
        .end(done);
    });
  });

  it('Test Put update que modifica una noticia', function(done) {
    var noticiaMod = noticia;
    noticiaMod.cuerpo = 'ohyeahcuerpomodificado';
    models.Noticia.findAll().then(function(results) {
      var id = results[results.length - 1].id;
      supertest(app)
        .put('/api/noticias/' + id)
        .send(noticiaMod)
        .expect(204)
        .end(done);
    });
  });

  it('Test Delete que borra una noticia por id en el cuerpo', function(done) {
    models.Noticia.findAll().then(function(results) {
      var idu = results[results.length - 1].id;
      var cuerpo = {id: idu};
      supertest(app)
        .delete('/api/noticias')
        .send(cuerpo)
        .expect(204)
        .end(done);
    });
  });

});
