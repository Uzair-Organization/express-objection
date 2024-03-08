import logger from '../loaders/logger.js'

export default (err, req, res, next) => {
    const isProduction = process.env.nodeEnvironment === 'production';

    logger.info("**********************************************");
    logger.info("Error MIDDLEWARE Triggered");
    logger.info("**********************************************");

    if (err.name === 'badRequest') {
        return res.status(400).send({
            success: false,
            message: err.message
        }).end();
    }
    if (err.name === 'unAuthorized') {
        return res.status(401).send({
            success: false,
            message: err.message
        }).end();
    }
    if (err.name === 'permission') {
        return res.status(403).send({
            success: false,
            message: err.message
        }).end();
    }
    if (err.name === 'duplication') {
        return res.status(409).send({
            success: false,
            message: err.message
        }).end();
    }
    if (err.name === 'notFound') {
        return res.status(404).send({
            success: false,
            message: err.message
        }).end();
    }
    if (err.isOperational) {
        return res.status(400).send({
            success: false,
            message: err.message
        }).end();
    }

    return res.status(500).send({
        success: false,
        message: err.message
    }).end();
};
