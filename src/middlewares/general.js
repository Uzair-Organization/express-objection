'use strict'
import cryptoJS from 'crypto-js';
import logger from '../loaders/logger.js';

import { errorHandling } from '../utils/helper/errorObject.js';

// *************
// Token Decrypt
// *************

const tokenDecrypt = async (req, res, next) => {
    logger.info("Token Decrypt MIDDLEWARE Triggered");
    try {
        if (!req.headers.authorization || !req.headers.authorization.length) {
            throw errorHandling("User is unauthorized", "unAuthorized");
        }

        let token = req.headers.authorization.slice(7);

        token = await decryptData(token).catch((e) => { })
        req.headers.authorization = 'Bearer ' + token;
        next()
    } catch (e) {
        logger.info("Error in tokenDecrypt middleware: ", e)
        next(e)
    }
}

// *************
// Encrypt
// *************

const encryptData = async (value) => {
    logger.info("Encrypt Data MIDDLEWARE Triggered");
    return new Promise(function (resolve, reject) {
        try {
            let data = cryptoJS.AES.encrypt(value, process.env.crypto).toString();
            if (!data) errorHandling("Invalid user info", "unAuthorized");
            resolve(data)
        } catch (e) {
            logger.info("Error in encryptData middleware: ", e)
            reject(e)
        }
    });
}

// *************
// Decrypt
// *************

const decryptData = async (value) => {
    logger.info("Decrypt Data MIDDLEWARE Triggered");
    return new Promise(function (resolve, reject) {
        try {
            let bytes = cryptoJS.AES.decrypt(value, process.env.crypto);
            if (!bytes) throw errorHandling("Invalid token", "unAuthorised");
            let originalText = bytes.toString(cryptoJS.enc.Utf8);
            if (!originalText) errorHandling("Invalid token", "unAuthorised");

            resolve(originalText)
        } catch (e) {
            logger.info("Error in decryptData middleware: ", e)
            reject(e)
        }
    })
}

export default {
    encryptData,
    decryptData,
    tokenDecrypt,
}