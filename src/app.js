import express from 'express';
import cartRoutes from './routes/cartRoutes.js';
import productRoutes from './routes/productRoutes.js';

// Start App
const app = express();

// Basic Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', productRoutes());
app.use('/', cartRoutes());

// ERROR 404 NOT FOUND Route
app.use('*', (req, res) => {
  res.send('ERROR 404 NOT FOUND PAGE');
});

// Lauch Server
const SERVER_PORT = 8080;
app.listen(SERVER_PORT, () => {
  console.log(`Server ready and running on port: ${SERVER_PORT}`);
});
