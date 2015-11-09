var express = require('express');
var models  = require('../models');
var router = express.Router();

/* GET listado de noticias. */
router.get('/', function(pet, resp, next) {
  var numItems = 5; // número de items a mostrar
  var offset = 0;   // desde dónde empezamos a mostrar
  // cáculo de offset
  if (pet.query.page > 1) {
    offset = pet.query.page * numItems - numItems;
  }

  models.Noticia.findAndCountAll({ offset: offset, limit: numItems }).then(function(results) {
    // cálculo de cuántas páginas puede haber
    var paginas = Math.ceil(results.count / numItems);
    if (pet.query.page > paginas) {
      models.Noticia.findAndCountAll({ offset: paginas * numItems - numItems }).then(function(results) {
        resp.send(results);
      });
    } else {
      resp.send(results);
    }
  });
});

/* POST nueva noticia */
router.post('/', function(pet, resp, next) {
  var nuevo = pet.body;
  if (nuevo && nuevo.titulo && nuevo.fecha && nuevo.cuerpo && nuevo.UsuarioId && nuevo.CategoriaId) {
    models.Noticia.create({
      titulo: nuevo.titulo,
      fecha: nuevo.fecha,
      cuerpo: nuevo.cuerpo,
      UsuarioId: nuevo.UsuarioId,
      CategoriaId: nuevo.CategoriaId
    }).then(function(result) {
      resp.status(201);
      resp.location(pet.hostname + pet.originalUrl + "/" + result.id);
      resp.send("Noticia creada correctamente,");
      resp.end();
    }).catch(function(err) {
      resp.status(400);
      resp.send("El JSON no es válido o datos incongruentes.");
    });
  } else {
    resp.status(400);
    resp.send("El JSON no es válido.");
  }
});

/* GET noticia por id. */
router.get('/:id', function(pet, resp, next) {
  models.Noticia.findById(pet.params.id).then(function(noticia) {
    if (noticia) {
      resp.status(200);
      resp.send(noticia);
    } else {
      resp.status(404);
      resp.send("Id no encontrada.");
    }
  /*}).catch(function(err) {
    resp.send("Id no encontrada.");*/
  });
});

/* PUT Update de una noticia por id. */
router.put('/:id', function(pet, resp, next) {
  var modificar = pet.body;
  if (modificar && modificar.titulo && modificar.fecha && modificar.cuerpo && modificar.UsuarioId && modificar.CategoriaId) {
    models.Noticia.update({
      titulo: modificar.titulo,
      fecha: modificar.fecha,
      cuerpo: modificar.cuerpo,
      UsuarioId: modificar.UsuarioId,
      CategoriaId: modificar.CategoriaId
    }, {
      where: {
        id: pet.params.id
      }
    }).then(function(result) {
      if (result[0] == 1) {
        resp.status(204);
        resp.send("La noticia " + pet.params.id + " ha sido modificada correctamente.");
        resp.end();
      } else {
        resp.status(404);
        resp.send("La noticia " + pet.params.id + " no ha sido encontrada.");
        resp.end();
      }
    }).catch(function(err) {
      resp.status(400);
      resp.send("Fallo de query.");
      resp.end();
    })
  } else {
    resp.status(400);
    console.log(result);
    resp.send("JSON enviado inválido.");
    resp.end();
  }
});

/* DELETE de una noticia por id. */
router.delete('/', function(pet, resp, next) {
  var borrar = pet.body;
  if (borrar && borrar.id) {
    models.Noticia.destroy({
      where: {
        id: borrar.id
      }
    }).then(function(result) {
      if (result) {
        resp.status(204);
        resp.send("La noticia " + borrar.id + " ha sido eliminada correctamente.");
        resp.end();
      } else {
        resp.status(404);
        resp.send("La noticia " + borrar.id + " no ha sido encontrada.");
        resp.end();
      }
    }).catch(function(err) {
      resp.status(400);
      resp.send("EL JSON no es válido o no se ha podido acceder a la bbdd.");
      resp.end();
    });
  } else {
    resp.status(400);
    resp.send("EL JSON no es válido.");
    resp.end();
  }
});

module.exports = router;
