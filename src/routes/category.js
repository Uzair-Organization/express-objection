import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import middleware from '../middlewares/validators/index.js';
import passport from '../config/passport.js';
import logger from '../loaders/logger.js';
import _ from 'lodash';
import CategoryService from '../services/categoryService.js';
import general from '../middlewares/general.js';

const route = Router();

export default (app) => {
    app.use('/category', route);
    const categoryService = new CategoryService();

    route.use((req, res, next) => {
        logger.debug(`${req.method}: /category${req.url}`);
        next();
    });

    route.post('/', general.tokenDecrypt, passport.authenticate('jwt', { session: false }), validate(middleware.category.createCategory), categoryService.createCategory);
    route.get('/', validate(middleware.category.getAllCategories), categoryService.getAllCategories);
    route.get('/:id', validate(middleware.category.getCategoryById), categoryService.getCategoryById);
    route.put('/', general.tokenDecrypt, passport.authenticate('jwt', { session: false }), validate(middleware.category.updateCategory), categoryService.updateCategory);
    route.delete('/:id', general.tokenDecrypt, passport.authenticate('jwt', { session: false }), validate(middleware.category.deleteCategoryById), categoryService.deleteCategory);

    /**
    * @swagger
    * tags:
    *   name: Category
    *   description: Category Routes
    */

    /**
     * @swagger
     * /category:
     *   post:
     *     tags: [Category]
     *     summary: Create a new category
     *     description: Create a new category
     *     parameters:
     *       - in: body
     *         name: category
     *         required: true
     *         description: The category details for creation
     *         schema:
     *           type: object
     *           properties:
     *             name:
     *               type: string
     *               description: The name of the category
     *               example: Electronics
     *             description:
     *               type: string
     *               description: The description of the category
     *               example: Electronic devices and gadgets
     *             parentCategoryId:
     *               type: string
     *               description: The ID of the parent category (if applicable)
     *               example: 1
     *     responses:
     *       200:
     *         description: Category created successfully
     *       400:
     *         description: Bad request, invalid category details
     *     security:
   *       - bearerAuth: []
     */

    /**
     * @swagger
     * /category:
     *   get:
     *     tags: [Category]
     *     summary: Get a list of all categories
     *     description: Retrieve a list of all categories
     *     responses:
     *       200:
     *         description: List of categories retrieved successfully
     *       500:
     *         description: Internal server error
     */

    /**
     * @swagger
     * /category/{categoryId}:
     *   get:
     *     tags: [Category]
     *     summary: Get category by ID
     *     description: Retrieve a category by its ID
     *     parameters:
     *       - in: path
     *         name: categoryId
     *         required: true
     *         description: The ID of the category to retrieve
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Category retrieved successfully
     *       404:
     *         description: Category not found
     *  @swagger
     * /category/{categoryId}:
     *   delete:
     *     tags: [Category]
     *     summary: Delete category by ID
     *     description: Delete a category by its ID
     *     parameters:
     *       - in: path
     *         name: categoryId
     *         required: true
     *         description: The ID of the category to delete
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: Category deleted successfully
     *       404:
     *         description: Category not found
     *     security:
   *       - bearerAuth: []
     */
};
