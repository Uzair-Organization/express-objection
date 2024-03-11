import config from './src/config/index.js';
import express from 'express';
import logger from './src/loaders/logger.js';
import loaders from './src/loaders/index.js';

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });

  // start express server
  app.listen(config.port, () => {
    logger.info(`Started listening on port: ${config.port}`);
  }).on('error', err => {
    logger.error(err);
    process.exit(1);
  });
}

startServer();