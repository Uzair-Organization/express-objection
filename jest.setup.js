import express from 'express';
import loaders from './src/loaders/index.js';
import Category from './src/models/category.js';
import Product from './src/models/product.js';
import User from './src/models/user.js';

const app = express();
beforeAll(async () => {

    await loaders({ expressApp: app });
    if (process.env.NODE_ENV == 'test') {
        await Promise.all([User.query().delete(), Category.query().delete(), Product.query().delete()])
    }
});

afterAll(async () => {
});

export { app };
