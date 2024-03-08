import Joi from 'joi';

const createUser = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        phone: Joi.string().optional()
    }),
};

const loginUser = {
    body: Joi.object({
        password: Joi.string().min(6).required(),
        email: Joi.string().email().required(),
    })
}

const refreshToken = {
    body: Joi.object({
        refreshToken: Joi.string().min(6).required()
    })
};

export default {
    createUser,
    loginUser,
    refreshToken
};