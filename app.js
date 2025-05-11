console.log('app.js loaded');

require('dotenv').config();
const express = require('express');
const { sequelize, Admin } = require('./models');
const authenticateAdmin = require('./middleware/auth');
const participantRouter = require('./routes/participants');


const app = express();
app.use(express.json());

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to MySQL has been established successfully.')

    await sequelize.sync({ force: true });
    console.log('✅ Models synced');

    await Admin.findOrCreate({
      where: { username: 'admin' },
      defaults: { password: 'p4ssword' }
    });
    console.log('✅ Admin user ready')

    app.use('/participants', authenticateAdmin, participantRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log('Server listening on port ${PORT}');
      
    });
  
  } catch(err) {
    console.error('❌ Initialization error:', err);
    process.exit(1);
  }
  
}) ();
