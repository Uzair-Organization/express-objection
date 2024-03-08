import Knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import config from '../config/config.js';
const connection = {
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: config.database.connection.database,
    },
    pool: {
        min: 10,
        max: 50
    },
    ...knexSnakeCaseMappers()
}
const knex = Knex(connection);

export default knex;