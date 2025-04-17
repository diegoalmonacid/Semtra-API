// sequelize instance created in models
import { sequelize } from './models/index.js'
// environment variables
import 'dotenv/config'
import { app } from './app.js'
// initialize authentication from passport
import './services/auth.js'


const PORT = process.env.PORT || 3000;


sequelize.sync({ alter: true })
  .then(() => {
    //console.log('Conectado a la base de datos y modelos sincronizados');
    app.listen(PORT, () => {
      //console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar con la base de datos:', err);
  });