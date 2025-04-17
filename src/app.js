// libraries
import express from 'express'
import passport from 'passport'
import session from 'express-session'
import cors from'cors'
// importing routes
import routes from './routes/index.js'
import RedisStore from 'connect-redis'
import redis from 'redis'


// Creating redis client
const redisClient = redis.createClient({
  host: '127.0.0.1', // Cambia según tu configuración de Redis
  port: 6379,
});
// Manejar errores de conexión del cliente Redis
redisClient.on('error', (err) => {
  console.error('Error en Redis:', err);
});
redisClient.connect().catch(console.error);
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(session({secret:"cats",
  store: new RedisStore({ client: redisClient }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    //maxAge: 10*60*1000,
    httpOnly: true,
    secure: false
  },
  rolling: true
}))

// app.use((req, res, next) => {
//   //console.log('Session:', req.session);
//   //console.log('Cookies:', req.cookies);
//   next();
// });

app.use(passport.initialize()); 
app.use(passport.session());

// Para usar /api como prefijo de las rutas
const apiRouter = express.Router();
apiRouter.use('/auth', routes.authRoutes);
apiRouter.use('/categories', routes.categoryRoutes);
apiRouter.use('/executives', routes.executiveRoutes);
apiRouter.use('/partners', routes.partnerRoutes);
apiRouter.use('/users', routes.userRoutes);
apiRouter.use('/admins', routes.adminRoutes);
apiRouter.use('/tickets', routes.ticketRoutes);
apiRouter.use('/expenses', routes.expenseRoutes);
// Usar las rutas
app.use('/api', apiRouter);


// DEBUG ONLY
app.get('/session-ids', (req, res) => {
  if (req.sessionStore && req.sessionStore.all) {
    req.sessionStore.all((err, sessions) => {
      if (err) {
        return res.status(500).json({ error: 'Error retrieving sessions' });
      }
      const sessionIds = Object.keys(sessions);
      res.json({ sessions });
    });
  } else {
    res.status(500).json({ error: 'Session store not available' });
  }
});

export { app };
