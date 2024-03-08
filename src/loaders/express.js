import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { connectRabbitMQ } from '../utils/helper/rabbitmq.js';
import middlewares from '../middlewares/index.js';
import config from '../config/index.js';
import routes from '../routes/index.js';
import client from '../utils/helper/redis.js';

const expressLoader = async ({ app }) => {
  app.use(cors({ origin: '*' }));
  app.use(bodyParser.json());
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'STORE',
        version: '1.0.0',
        description: 'API documentation generated with Swagger',
      },
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        },
      },
    },
    apis: ['./src/routes/*.js'],
  };

  const specs = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  if (process.env.NODE_ENV != 'test') {
    client.connect()
  }

  connectRabbitMQ('amqp://localhost');

  app.use(middlewares.response);

  app.use(config.api.prefix, routes())

  app.use(middlewares.errorHandler);
};

export default expressLoader;
