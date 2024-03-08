import dotenv from 'dotenv';

process.env.nodeEnvironment = process.env.nodeEnvironment || 'development';
const envFound = dotenv.config();

if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    port: parseInt(3000, 10),
    secretKey: "session-secret",
    logs: {
        level: process.env.logLevel || 'silly',
    },
    api: {
        prefix: '/',
    }
};
