import app from './app.js';
import config from './config/config.js';
import dbConnect from './config/dbConnect.js';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import authRoutes from './routes/authRoutes.js';
import product from './routes/userRoutes.js';
import createProdct from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

app.use(cookieParser()); // Use cookie-parser middleware

app.get('/', (req, res) => {
  return res.send('welcome to the home page');
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'cafe-Api',
      version: '1.0.0',
      description: 'A simple express api',
    },
    servers: [
      {
        url: 'http://localhost:3000/u',
      },
      {
        url: 'http://localhost:300/product',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs)); // Fixed: added leading slash to path

app.use('/u', authRoutes);
app.use('/u', product);
app.use('/u', createProdct);
app.use('/product', product);
app.use('/user/products', paymentRoutes);

app.use((req, res, next) => {
  res.status(404).send('Sorry, the requested resource was not found.');
});

app.listen(config.app.PORT, () => {
  console.log(`Server is running on port ${config.app.PORT}`);
  dbConnect();
});
