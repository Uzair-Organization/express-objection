import amqp from 'amqplib';
import logger from '../../loaders/logger.js'

let connection;
let channels = {};

export async function connectRabbitMQ(url) {
  try {
    connection = await amqp.connect(url);
    logger.info('Connected to RabbitMQ');
  } catch (error) {
    logger.error('Error connecting to RabbitMQ:', error.message);
    throw error;
  }
}

export async function getChannel(appName, exchangeType = 'direct') {
  if (!connection) {
    throw new Error('RabbitMQ connection not established');
  }

  if (!channels[appName]) {
    channels[appName] = await connection.createChannel();

    const channel = channels[appName];

    await channel.assertExchange('category', exchangeType, {
      durable: true,
    });

    logger.info(`Channel created for ${appName}`);
  }

  return channels[appName];
}


export async function publishMessage(message, routingKey, queue, exchangeType) {
  try {
    const channel = await getChannel('express-objection', exchangeType);

    await channel.assertQueue(queue);
    await channel.bindQueue(queue, 'category', 'category.info')
    await channel.publish('category', routingKey, Buffer.from(message));

    logger.info(`Message published to exchange with routing key: ${routingKey}`);
  } catch (error) {
    logger.error('Error publishing message:', error.message);
    throw error;
  }
}


export async function closeRabbitMQ() {
  if (connection) {
    await connection.close();
    logger.info('Closed RabbitMQ connection');
  }
}
