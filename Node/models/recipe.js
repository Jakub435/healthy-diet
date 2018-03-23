var Sequelize = require('sequelize');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('diet', 'postgres', 'asdf1234', {
  host: 'localhost',
  port:'5433',
  dialect: 'postgres',
  define: {timestamps: false}
});
// setup recipe model and its fields.
var Recipe = sequelize.define('recipe', {
    meal_type: {
        type: Sequelize.STRING(20),
        allowNull: true
    },
    meal_name:{
        type: Sequelize.STRING(80),
        allowNull: false
    },
    preparation:{
        type: Sequelize.STRING(1000),
        allowNull: false
    },
    kcal_per_unit:{
        type: Sequelize.REAL,
        allowNull: false
    },
    author_id:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    cost_per_unit:{
        type: Sequelize.REAL,
        allowNull: true
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('recipe table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured'));

// export recipe model for use in other files.
module.exports = Recipe;
