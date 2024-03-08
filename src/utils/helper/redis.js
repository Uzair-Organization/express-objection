import redis from 'redis';
import ioRedis from 'ioredis-mock';
import logger from '../../loaders/logger.js';

const isTestEnvironment = process.env.NODE_ENV === 'test';

let client;

if (isTestEnvironment) {
    client = new ioRedis();
} else {
    const { createClient } = redis;
    client = createClient({
        host: 'localhost',
        port: 6379,
    });


    client.on('connect', () => {
        logger.info('Connected to Redis server');
    });

    client.on('error', (err) => {
        logger.error('Redis connection error:', err);
    });
}
export default client;
