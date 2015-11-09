var express = require('express');
var models  = require('../models');
var router = express.Router();

// funcion de comprobación de auth
function checkAuth(pet, resp, next) {
  var auth = pet.get("authorization");
  if (!auth) {
    resp.set("WWW-Authenticate", "Basic realm=\"Autorización Requerida\"");
    return resp.status(401).send("Autorización incorrecta");
  } else {
    next();
  }
}

/* GET listado de usuarios. */
router.get('/', checkAuth, function(pet, resp, next) {
  auth = pet.get("authorization");
  var credentials = new Buffer(auth.split(" ").pop(), "base64").toString("ascii").split(":");
  models.Usuario.findOne({where:{nombre: credentials[0]}}).then(function(usuario) {
    if (usuario != null) {
      if (credentials[0] == usuario.nombre && credentials[1] == usuario.password) {
        var numItems = 10; // número de items a mostrar
        var offset = 0;   // desde dónde empezamos a mostrar
        // cáculo de offset
        if (pet.query.page > 1) {
          offset = pet.query.page * numItems - numItems;
        }
        models.Usuario.findAndCountAll({ offset: offset, limit: numItems }).then(function(results) {
          // cálculo de cuántas páginas puede haber
          var paginas = Math.ceil(results.count / numItems);

          if (pet.query.page > paginas) {
            models.Usuario.findAndCountAll({ offset: paginas * numItems - numItems, limit: numItems }).then(function(results) {
              resp.send(results);
            });
          } else {
            resp.send(results);
          }
        });
      } else {
        resp.set("WWW-Authenticate", "Basic realm=\"Autorización Requerida\"");
        return resp.status(401).send("Autorización incorrecta");
      }
    } else {
      resp.sendStatus(404);
    }
  });
});

/* POST nuevo usuario */
router.post('/', function(pet, resp, next) {
  var nuevo = pet.body;
  if (nuevo && nuevo.nombre && nuevo.password) {
    models.Usuario.create({nombre: nuevo.nombre, password: nuevo.password}).then(function(result) {
      resp.status(201);
      resp.location(pet.hostname + pet.originalUrl + "/" + result.id);
      resp.send("Usuario " + nuevo.nombre + " creado correctamente.");
      resp.end();
    }).catch(function(err) {
      resp.status(400);
      resp.send("EL JSON no es válido (campos: nombre) o no se ha podido acceder a la bbdd.");
      resp.end();
    });
  } else {
    resp.status(400);
    resp.send("EL JSON no es válido (campos: nombre).");
    resp.end();
  }
});

/* GET usuario por id. */
router.get('/:id', function(pet, resp, next) {
  models.Usuario.findById(pet.params.id).then(function(usuario) {
    if (usuario) {
      resp.status(200);
      resp.send(usuario);
    } else {
      resp.status(404);
      resp.send("Id no encontrada.");
    }
  /*}).catch(function(err) {
    resp.send("Id no encontrada.");*/
  });
});

/* PUT Update de un usuario por id. */
router.put('/:id', function(pet, resp, next) {
  var modificar = pet.body;
  if (modificar && modificar.nombre) {
    models.Usuario.update({
      nombre: modificar.nombre
    }, {
      where: {
        id: pet.params.id
      }
    }).then(function(result) {
      if (result[0] == 1) {
        resp.status(204);
        resp.send("El usuario " + pet.params.id + " ha sido modificado correctamente.");
        resp.end();
      } else {
        resp.status(404);
        resp.send("El usuario " + pet.params.id + " no ha sido encontrado.");
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

/* DELETE de un usuario por id. */
router.delete('/', function(pet, resp, next) {
  var borrar = pet.body;
  if (borrar && borrar.id) {
    models.Usuario.destroy({
      where: {
        id: borrar.id
      }
    }).then(function(result) {
      if (result) {
        resp.status(204);
        resp.send("El usuario " + borrar.id + " ha sido eliminado correctamente.");
        resp.end();
      } else {
        resp.status(404);
        resp.send("El usuario " + borrar.id + " no ha sido encontrado.");
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

/* GET noticias de un usuario por id. */
router.get('/:id/noticias', function(pet, resp, next) {
  var numItems = 5; // número de items a mostrar
  var offset = 0;   // desde dónde empezamos a mostrar
  // cáculo de offset
  if (pet.query.page > 1) {
    offset = pet.query.page * numItems - numItems;
  }

  models.Usuario.findById(pet.params.id).then(function(usuario) {
    if (usuario) {
      models.Noticia.findAndCountAll({
        offset: offset,
        limit: numItems,
        where: {
          UsuarioId: pet.params.id
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
