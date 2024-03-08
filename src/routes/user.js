import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import middleware from '../middlewares/validators/index.js';
import passport from '../config/passport.js';
import logger from '../loaders/logger.js';
import _ from 'lodash';
import AccountService from '../services/userService.js';
import general from '../middlewares/general.js';

const route = Router();

export default (app) => {
  app.use('/user', route);

  const accountService = new AccountService();

  route.use((req, res, next) => {
    logger.debug(`${req.method}: /user${req.url}`);
    next();
  });

  route.post('/signup', validate(middleware.account.createUser), accountService.createUser);
  route.post('/login', validate(middleware.account.loginUser), accountService.login);
  route.post('/logout', general.tokenDecrypt, passport.authenticate('jwt', { session: false }), accountService.logout);
  route.post('/refresh_token', validate(middleware.account.refreshToken), accountService.refreshToken);
  route.get('/profile', general.tokenDecrypt, passport.authenticate('jwt', { session: false }), accountService.getProfileInfo);

  /**
* @swagger
* tags:
*   name: User
*   description: User Routes
*/

  /**
   * @swagger
   * /user/signup:
   *   post:
   *     tags: [User]
   *     summary: Create a new user
   *     description: Create a new user with the provided details
   *     parameters:
   *       - in: body
   *         name: user
   *         required: true
   *         description: The user details for registration
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *               description: The username of the user
   *               example: test@gmail.com
   *             password:
   *               type: string
   *               description: The password of the user
   *               example: test@123
   *             phone:
   *               type: string
   *               example: +92345678910
   *     responses:
   *       200:
   *         description: User created successfully
   *       400:
   *         description: Bad request, invalid user details
   */

  /**
* @swagger
* /user/login:
*   post:
*     tags: [User]
*     summary: User login
*     description: Log in with the provided email and password
*     parameters:
*       - in: body
*         name: user
*         required: true
*         description: User credentials for login
*         schema:
*           type: object
*           properties:
*             email:
*               type: string
*               description: The email of the user
*               example: test@gmail.com
*             password:
*               type: string
*               description: The password of the user
*               example: test@123
*     responses:
*       200:
*         description: Login successful, returns access token
*       401:
*         description: Unauthorized, invalid credentials
*/

  /**
   * @swagger
   * /user/logout:
   *   post:
   *     tags: [User]
   *     summary: User logout
   *     description: Log out the user
   *     responses:
   *       200:
   *         description: Logout successful
   *       401:
   *         description: Unauthorized, user not logged in
   *     security:
   *       - bearerAuth: []  # Indicates that the route requires JWT authentication
   */

  /**
   * @swagger
   * /user/refresh_token:
   *   post:
   *     tags: [User]
   *     summary: Refresh user access token
   *     description: Refresh the user's access token using the refresh token
   *     parameters:
   *       - in: body
   *         name: refreshToken
   *         required: true
   *         description: The refresh token
   *         schema:
   *           type: object
   *           properties:
   *             refreshToken:
   *               type: string
   *               description: The refresh token
   *               example: your_refresh_token
   *     responses:
   *       200:
   *         description: Access token refreshed successfully
   *       400:
   *         description: Bad request, invalid refresh token
   *     security:
   *       - bearerAuth: []  # Indicates that the route requires JWT authentication
   */

  /**
   * @swagger
   * /user/profile:
   *   get:
   *     tags: [User]
   *     summary: Get user profile
   *     description: Get the profile information of the logged-in user
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *       401:
   *         description: Unauthorized, user not logged in
   *     security:
   *       - bearerAuth: []  # Indicates that the route requires JWT authentication
   */


};