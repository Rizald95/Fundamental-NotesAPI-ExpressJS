import express from 'express';
import routes from '../routes/index.js';
import ErrorHandler from '../middlewares/error.js';
import { swaggerUi, swaggerDocument, swaggerOptions } from '../swagger-config.js';
 
const app = express();
 
app.use(express.json());

// Swagger API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use('/uploads', express.static('src/services/uploads/files/images'));
app.use(routes);
app.use(ErrorHandler);
 
export default app;