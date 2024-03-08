'use strict';

import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
import { dirname, join } from 'path';

const __dirname = dirname(new URL(import.meta.url).pathname);

const envPath = join(process.cwd(), '.env');

dotenv.config({ path: envPath });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_IGNORE_EXPIRATION: Joi.boolean().required(),
    JWT_REQ_CALLBACK: Joi.boolean().required(),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.string().default('1h').description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.string().default('1d').description('days after which refresh tokens expire'),
    DATABASE: Joi.string().required().description('Database name'),
    DB_USER: Joi.string().required().description('Database user'),
    PASSWORD: Joi.string().required().description('Database password'),
    HOST: Joi.string().required().description('Database host'),
    CRYPTO: Joi.string().required().description('Encryption secret'),
    ACCESS_TOKEN_EXPIRY: Joi.string().default('1h').description('Access token expiry time'),
    REFRESH_TOKEN_EXPIRY: Joi.string().default('1d').description('Refresh token expiry time'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtOptions: {
    secretOrKey: envVars.JWT_SECRET,
    ignoreExpiration: envVars.JWT_IGNORE_EXPIRATION,
    passReqToCallback: envVars.JWT_REQ_CALLBACK,
  },
  database: {
    client: 'pg',
    connection: {
      host: envVars.HOST,
      user: envVars.DB_USER,
      password: envVars.PASSWORD,
      database: envVars.NODE_ENV == 'development' || envVars.NODE_ENV == 'production' ? 'koa' : 'test',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'path/to/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'path/to/seeds'),
    },
  },
  crypto: envVars.CRYPTO,
  accessTokenExpiry: envVars.ACCESS_TOKEN_EXPIRY,
  refreshTokenExpiry: envVars.REFRESH_TOKEN_EXPIRY,
};

export default config;
