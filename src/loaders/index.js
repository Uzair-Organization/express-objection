import expressLoader from './express.js';
import logger from './logger.js';
import { Model } from 'objection';
import knex from '../models/index.js';

export default async ({ expressApp }) => {
  try {
    
    Model.knex(knex);

    logger.info('|||======================> ');

    logger.info('✌️ Dependency Injector loaded');

    await expressLoader({ app: expressApp });
  } catch (e) {
    logger.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
