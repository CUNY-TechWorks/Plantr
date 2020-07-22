const Sequelize = require("sequelize");

const db = new Sequelize('postgres://localhost:5432/plantr', {
    logging: false,
});

const Gardener = db.define("gardener", {
   name: {
     type: Sequelize.STRING,
     allowNull: false,
     unique: true,
   },
   age: {
     type: Sequelize.INTEGER,
     allowNull: false,
   }
});

const Plot = db.define('plot', {
   size: {
     type: Sequelize.INTEGER,
     allowNull: false,
   },
   shaded: {
     type: Sequelize.BOOLEAN,
     allowNull: false,
   }
});

const Vegetable = db.define('vegetable', {
   name: {
     type: Sequelize.STRING,
     allowNull: false,
   },
   color: {
     type: Sequelize.STRING,
     allowNull: false,
   },
   planted_on: {
     type: Sequelize.DATE,
     allowNull: false,
   },
})

// Gardener instances have access to methods such as getPlot() or setPlot()
Gardener.hasOne(Plot);

// Plot instances have access to methods such as getGardener() or setGardener()
// Plot can't exist without a gardener, so therefore, the gardenerId key can't be null
Plot.belongsTo(Gardener, { as: 'gardener', foreignKey: { allowNull: false }});

// Gardener instances have access to methods such as getFavorite_vegetable() or setVegetable()
Gardener.belongsTo(Vegetable, { as: "favorite_vegetable"});

Vegetable.belongsToMany(Plot, { through: 'vegetable_plot'});
Plot.belongsToMany(Vegetable, { through: 'vegetable_plot'});

module.exports = { db, Gardener, Plot, Vegetable };