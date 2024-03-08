import Joi from 'joi';

const createProduct = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        inStock: Joi.boolean().required(),
        price: Joi.number().min(0).required(),
        sku: Joi.string().required(),
        categoryId: Joi.number().required()
    }),
};

const updateProduct = {
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
    }),
    body: Joi.object({
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        inStock: Joi.boolean().optional(),
        price: Joi.number().min(0).optional(),
        sku: Joi.string().optional(),
        categoryId: Joi.number().optional()
    }),
};

const getProductById = {
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
    }),
};

const deleteProductById = {
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
    }),
};

export default {
    createProduct,
    updateProduct,
    getProductById,
    deleteProductById,
};
