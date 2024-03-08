import Joi from 'joi';

const createCategory = {
    body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().optional(),
        parentCategoryId: Joi.number().optional(),
        products: Joi.array().items({
            title: Joi.string().required(),
            description: Joi.string().required(),
            inStock: Joi.boolean().required(),
            price: Joi.number().min(0).required(),
            sku: Joi.string().required(),
        }).optional()
    }),
};

const updateCategory = {
    body: Joi.object({
        id: Joi.number().optional(),
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        parentCategoryId: Joi.number().optional(),
        products: Joi.array().items({
            id: Joi.number().optional(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            inStock: Joi.boolean().required(),
            price: Joi.number().min(0).required(),
            sku: Joi.string().required(),
            categoryId: Joi.number().optional(),
            createdAt: Joi.string().optional(),
            updatedAt: Joi.string().optional(),
        }).optional(),
        createdAt: Joi.string().optional(),
        updatedAt: Joi.string().optional(),
    }),
};

const getCategoryById = {
    params: Joi.object({
        id: Joi.number().required(),
    }),
};

const deleteCategoryById = {
    params: Joi.object({
        id: Joi.number().required(),
    }),
};

const getAllCategories = {
    query: Joi.object({
        page: Joi.number().optional(),
        limit: Joi.number().optional(),
    }),
};

export default {
    createCategory,
    updateCategory,
    getCategoryById,
    deleteCategoryById,
    getAllCategories
};
