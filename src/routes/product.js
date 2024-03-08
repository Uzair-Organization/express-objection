import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import middleware from '../middlewares/validators/index.js';
import passport from '../config/passport.js';
import logger from '../loaders/logger.js';
import _ from 'lodash';
import ProductService from '../services/productService.js';
import general from '../middlewares/general.js';

const router = Router();

export default (app) => {
    app.use('/product', router);
    const productService = new ProductService();

    router.use((req, res, next) => {
        logger.debug(`${req.method}: /product${req.url}`);
        next();
    });

    router.get('/', productService.getAllProducts);
    router.get('/:id', productService.getProductById);
    router.post('/', general.tokenDecrypt, passport.authenticate('jwt', { session: false }), validate(middleware.product.createProduct), productService.createProduct);
    router.put('/:id', general.tokenDecrypt, passport.authenticate('jwt', { session: false }), validate(middleware.product.updateProduct), productService.updateProduct);
    router.delete('/:id', general.tokenDecrypt, passport.authenticate('jwt', { session: false }), validate(middleware.product.deleteProductById), productService.deleteProduct);

}