"use strict";

module.exports = function(sequelize, DataTypes) {
  var Usuario = sequelize.define("Usuario", {
    nombre: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    name: {
      singular: 'Usuario',
      plural: 'Usuarios'
    }
  }, {
    classMethods: {
      associate: function(models) {
        Usuario.hasMany(models.Noticia)
      }
    }
  });

  return Usuario;
};
