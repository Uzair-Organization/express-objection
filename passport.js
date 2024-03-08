'use strict'

import passport from 'passport';
import passportJWT from 'passport-jwt';
import _ from 'lodash';

let ExtractJwt = passportJWT.ExtractJwt
let JwtStrategy = passportJWT.Strategy

let newConfig = {
    jwtOptions: {
        'secretOrKey': process.env.secretOrKey || 'oneTwoThreeFour',
        'ignoreExpiration': process.env.ignoreExpiration || false,
        'passReqToCallback': process.env.passReqToCallback || true
    }
}

newConfig.jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
var strategy = new JwtStrategy(newConfig.jwtOptions, (req, jwtPayload, next) => {

    if (!_.isEmpty(jwtPayload.data)) {
        jwtPayload = jwtPayload.data
    }
    next(null, jwtPayload)
})
passport.use(strategy)

export default passport;