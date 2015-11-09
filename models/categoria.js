"use strict";

module.exports = function(sequelize, DataTypes) {
  var Categoria = sequelize.define("Categoria", {
    nombre: DataTypes.STRING
  }, {
    name: {
      singular: 'Categoria', plural: 'Categorias'
    }
  }, {
    classMethods: {
      associate: function(models) {
        Categorias.hasMany(models.Noticia);
      }
    }
  });

  return Categoria;
};
