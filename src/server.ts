// src/server.ts
// Configurations de Middlewares
import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './swagger';
import morgan from 'morgan';
import { ONE_HUNDRED, SIXTY } from './core/constants';
import user from './routes/user-routes';
import book from './routes/book-routes';
import loand from './routes/loand-routes';
import notification from './routes/notification-routes';

const app = express();

// Configurations de securité
// app.use(helmet() //Pour configurer les entete http securisés
// app.use(cors())) // Pour gerer le partage des ressources

// Configuration globaux de l'application express
app.use(express.json()); // parser les requets json
app.use(express.urlencoded({ extended: true })); // parser les requetes url encoder
app.use(compression()); //compression des requetes http
app.use(
	rateLimit({
		max: ONE_HUNDRED,
		windowMs: SIXTY,
		message: 'Trop de Requete à partir de cette adresse IP '
	})
);//limite le nombre de requete
app.use(morgan('combined'));// Journalisation des requetes au format combined

// Routes de mon application
app.use('/users',user);
app.use('/books', book);
app.use('/loands', loand);
app.use('/notifications', notification);

// Configuration de la documentation avec Swagger
setupSwagger(app);

export default app;
