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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(
	rateLimit({
		max: ONE_HUNDRED,
		windowMs: SIXTY,
		message: 'Trop de Requete à partir de cette adresse IP '
	})
);

app.use(morgan('combined'));

// Routes de mon application
app.use('/users',user);
app.use('/books', book);
app.use('/loands', loand);
app.use('/notifications', notification);


setupSwagger(app);
export default app;
