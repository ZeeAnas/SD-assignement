require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const fs   = require('fs');
const path = require('path');


const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DB_USERNAME,    
  process.env.DB_PASSWORD,    
  {
    host:    process.env.DB_HOST,
    port:    process.env.DB_PORT,
    dialect: process.env.DIALECT,  
    logging: false
  }
);


const db = { sequelize, Sequelize };


fs
  .readdirSync(__dirname)
  .filter(file =>
    file !== path.basename(__filename) &&
    file.endsWith('.model.js')
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize, DataTypes
    );
    db[model.name] = model;
  });


Object.values(db)
  .filter(mod => typeof mod.associate === 'function')
  .forEach(mod => mod.associate(db));


module.exports = db;