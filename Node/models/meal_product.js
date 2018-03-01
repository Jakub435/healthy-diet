var Sequelize = require('sequelize');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('diet', 'postgres', 'asdf1234', {
  host: 'localhost',
  port:'5433',
  dialect: 'postgres',
  define: {timestamps: false}
});
// setup recipe model and its fields.
var Meal_product = sequelize.define('meal_product', {
    recipe_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    product_id:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    percent_per_meal:{
        type: Sequelize.REAL,
        allowNull: false
    }
});

Meal_product.removeAttribute('id');

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('meal_product table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export Meal_product model for use in other files.
module.exports = Meal_product;
