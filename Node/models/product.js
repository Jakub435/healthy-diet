var Sequelize = require('sequelize');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('diet', 'postgres', 'asdf1234', {
  host: 'localhost',
  port:'5433',
  dialect: 'postgres',
  define: {timestamps: false}
});
// setup recipe model and its fields.
var Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    product_name:{
        type: Sequelize.STRING(80),
        allowNull: false
    },
    cost_per_unit:{
        type: Sequelize.REAL,
        allowNull: false
    }
});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log(''))
    .catch(error => console.log('This error occured'));

// export Product model for use in other files.
module.exports = Product;
