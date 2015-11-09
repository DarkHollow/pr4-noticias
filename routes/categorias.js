var express = require('express');
var models  = require('../models');
var router = express.Router();

/* GET listado de categorías. */
router.get('/', function(pet, resp, next) {
  var numItems = 5; // número de items a mostrar
  var offset = 0;   // desde dónde empezamos a mostrar
  // cáculo de offset
  if (pet.query.page > 1) {
    offset = pet.query.page * numItems - numItems;
  }

  models.Categoria.findAndCountAll({ offset: offset, limit: numItems }).then(function(results) {
    // cálculo de cuántas páginas puede haber
    var paginas = Math.ceil(results.count / numItems);
    if (pet.query.page > paginas) {
      models.Categoria.findAndCountAll({ offset: paginas * numItems - numItems }).then(function(results) {
        resp.send(results);
      });
    } else {
      resp.send(results);
    }
  });
});

/* POST nueva categoría */
router.post('/', function(pet, resp, next) {
  var nuevo = pet.body;
  if (nuevo && nuevo.nombre) {
    models.Categoria.create({
      nombre: nuevo.nombre
    }).then(function(result) {
      resp.status(201);
      resp.location(pet.hostname + pet.originalUrl + "/" + result.id);
      resp.send("Categoría creada correctamente,");
      resp.end();
    }).catch(function(err) {
      resp.status(400);
      resp.send("El JSON no es válido o datos incongruentes.");
    });
  } else {
    resp.status(400);
    resp.send("El JSON no es válido hola.");
  }
});

/* GET categoria por id. */
router.get('/:id', function(pet, resp, next) {
  models.Categoria.findById(pet.params.id).then(function(categoria) {
    if (categoria) {
      resp.status(200);
      resp.send(categoria);
    } else {
      resp.status(404);
      resp.send("Id no encontrada.");
    }
  /*}).catch(function(err) {
    resp.send("Id no encontrada.");*/
  }).catch(function(err) {
    resp.send("Error al acceder bbdd.");
  });
});

/* PUT Update de una categoría por id. */
router.put('/:id', function(pet, resp, next) {
  var modificar = pet.body;
  if (modificar && modificar.nombre) {
    models.Categoria.update({
      nombre: modificar.nombre
    }, {
      where: {
        id: pet.params.id
      }
    }).then(function(result) {
      if (result[0] == 1) {
        resp.status(204);
        resp.send("La categoría " + pet.params.id + " ha sido modificada correctamente.");
        resp.end();
      } else {
        resp.status(404);
        resp.send("La categoría " + pet.params.id + " no ha sido encontrada.");
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

/* DELETE de una categoría por id. */
router.delete('/', function(pet, resp, next) {
  var borrar = pet.body;
  if (borrar && borrar.id) {
    models.Categoria.destroy({
      where: {
        id: borrar.id
      }
    }).then(function(result) {
      if (result) {
        resp.status(204);
        resp.send("La categoría " + borrar.id + " ha sido eliminada correctamente.");
        resp.end();
      } else {
        resp.status(404);
        resp.send("La categoría " + borrar.id + " no ha sido encontrada.");
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

/* GET noticias de una categoria por id. */
router.get('/:id/noticias', function(pet, resp, next) {
  var numItems = 5; // número de items a mostrar
  var offset = 0;   // desde dónde empezamos a mostrar
  // cáculo de offset
  if (pet.query.page > 1) {
    offset = pet.query.page * numItems - numItems;
  }

  models.Categoria.findById(pet.params.id).then(function(categoria) {
    if (categoria) {
      models.Noticia.findAndCountAll({
        offset: offset,
        limit: numItems,
        where: {
          CategoriaId: pet.params.id
        }
      }).then(function(results) {
        resp.status(200);
        resp.send(results);
      });
    } else {
      resp.status(400);
      resp.send("Id no encontrada.");
    }
  });
});

module.exports = router;
