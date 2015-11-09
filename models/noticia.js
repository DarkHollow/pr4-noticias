"use strict";

module.exports = function(sequelize, DataTypes) {
  var Noticia = sequelize.define("Noticia", {
    titulo: DataTypes.STRING,
    fecha: DataTypes.DATE,
    cuerpo: DataTypes.TEXT
  }, {

      name: {
        singular: 'Noticia', plural: 'Noticias'
      },
    classMethods: {
      associate: function(models) {
        Noticia.belongsTo(models.Usuario, {
          onDelete: "CASCADE",
          constraints: false,
          foreignKey: {
            allowNull: false
          }
        });
        Noticia.belongsTo(models.Categoria, {
          onDelete: "CASCADE",
          constraints: false,
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Noticia;
};
