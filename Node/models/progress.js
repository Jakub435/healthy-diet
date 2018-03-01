var Sequelize = require('sequelize');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('diet', 'postgres', 'asdf1234', {
  host: 'localhost',
  port:'5433',
  dialect: 'postgres',
  define: {timestamps: false}
});
// setup recipe model and its fields.
var Progress = sequelize.define('progress', {
    weight: {
        type: Sequelize.REAL,
        allowNull: true
    },
    bf:{
        type: Sequelize.REAL,
        allowNull: true
    },
    biceps:{
        type: Sequelize.REAL,
        allowNull: true
    },
    forearm:{
        type: Sequelize.REAL,
        allowNull: true
    },
    waist:{
        type: Sequelize.REAL,
        allowNull: true
    },
    calf:{
        type: Sequelize.REAL,
        allowNull: true
    },
    hip:{
        type: Sequelize.REAL,
        allowNull: true
    },
    chest:{
        type: Sequelize.REAL,
        allowNull: true
    },
    thigh:{
        type: Sequelize.REAL,
        allowNull: true
    },
    user_id:{
        type: Sequelize.REAL,
        allowNull: true
    },
    date:{
        type: Sequelize.DATE,
        allowNull: true
    },
});

Progress.removeAttribute('id');

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('progress table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export progress model for use in other files.
module.exports = Progress;
