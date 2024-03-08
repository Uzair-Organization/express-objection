'use strict'

import passport from 'passport';
import passportJWT from 'passport-jwt';
import _ from 'lodash';
import config from './config.js';

let ExtractJwt = passportJWT.ExtractJwt
let JwtStrategy = passportJWT.Strategy

let newConfig = {
    jwtOptions: {
        'secretOrKey': config.jwtOptions.secretOrKey,
        'ignoreExpiration': config.jwtOptions.ignoreExpiration,
        'passReqToCallback': true
    }
}

newConfig.jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
var strategy = new JwtStrategy(newConfig.jwtOptions, (req, jwtPayload, done) => {

    if (!_.isEmpty(jwtPayload.data)) {
        jwtPayload = jwtPayload.data
    }
    done(null, jwtPayload)
})
passport.use(strategy)

export default passport;