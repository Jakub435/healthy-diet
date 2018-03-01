var Sequelize = require('sequelize');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('diet', 'postgres', 'asdf1234', {
  host: 'localhost',
  port:'5433',
  dialect: 'postgres',
  define: {timestamps: false}
});
// setup recipe model and its fields.
var User_meal = sequelize.define('user_meal', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    recipe_id:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    date:{
        type: Sequelize.DATE,
        allowNull: false
    },
    weight:{
        type: Sequelize.REAL,
        allowNull: false
    }
});

User_meal.removeAttribute('id');
// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('user_meal table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export user_meal model for use in other files.
module.exports = User_meal;
