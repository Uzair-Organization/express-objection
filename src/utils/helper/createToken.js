import jwt from 'jsonwebtoken'
import config from '../../config/config.js';

// **************************
// sign jwt token
// **************************

let jwtConfig = {
    jwtOptions: {
        'secretOrKey': config.jwtOptions.secretOrKey,
        'ignoreExpiration': config.jwtOptions.ignoreExpiration
    }
}

const signLoginData = (userInfo, time) => {
    return new Promise((resolve, reject) => {
        var token = jwt.sign(userInfo, jwtConfig.jwtOptions.secretOrKey, { expiresIn: time })
        return resolve(token)
    })
}

export {
    signLoginData,
};