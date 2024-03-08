import { signLoginData } from '../utils/helper/createToken.js';
import config from '../config/config.js';
import User from '../models/user.js';
import crypto from 'crypto';
import general from '../middlewares/general.js';
import jwt from 'jsonwebtoken';
import { errorHandling } from '../utils/helper/errorObject.js';

export default class AccountService {
  async createUser(req, res, next) {
    try {
      const { name, email, password, phone } = req.body;
      const existingUser = await User.query().where('email', email).first();

      if (existingUser) return res.status(400).json({ success: false, message: 'Email already exists' });

      let salt = Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64'),
        hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

      let data = {
        name,
        email,
        salt,
        hashedPassword,
        phone
      }

      await User.query().insert(data);

      res.status(201).json({ success: true, message: "User created successfully!" });
    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body,
        userData = {};
      const user = await User.query().where('email', email).first();
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('base64');
      if (hashedPassword != user.hashedPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      userData.userInfo = user;
      const tokenData = {
        id: userData.userInfo.id,
        email: userData.userInfo.email
      }

      userData.userInfo = {
        ...tokenData,
      }

      let accessToken = await signLoginData({ data: tokenData }, config.accessTokenExpiry);
      let newRefreshToken = await signLoginData({ data: "" }, config.refreshTokenExpiry);

      accessToken = await general.encryptData(accessToken);

      userData.accessToken = accessToken;
      userData.refreshToken = newRefreshToken;

      await user.$query().patch({ 'refreshToken': newRefreshToken });

      res.status(200).json(userData);
    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      res.status(200).json({ success: true, message: "Logged-out successfully!" });
    } catch (error) {
      console.error('Error on logout:', error);
      next(error)
    }
  }

  async refreshToken(req, res, next) {
    try {
      let { refreshToken } = req.body,
        userData = {};
      try {
        jwt.verify(refreshToken, config.jwtOptions.secretOrKey);
      } catch (error) {
        throw errorHandling("Unauthorized! refresh token has been expired", "permission")
      }
      const user = await User.query().where('refreshToken', refreshToken).first();

      if (!user || user == null) {
        throw errorHandling("Invalid token", "permission")
      }

      userData.userInfo = user;
      const tokenData = {
        id: userData.userInfo.id,
        email: userData.userInfo.email
      }

      userData.userInfo = {
        ...tokenData,
      }

      let accessToken = await signLoginData({ data: tokenData }, config.accessTokenExpiry);
      let newRefreshToken = await signLoginData({ data: "" }, config.refreshTokenExpiry);

      accessToken = await general.encryptData(accessToken);

      userData.accessToken = accessToken;
      userData.refreshToken = newRefreshToken;

      user.refreshToken = newRefreshToken;
      await user.$query().patch({ refreshToken: newRefreshToken });

      res.status(200).json(userData)
    } catch (error) {
      next(error)
    }
  }

  async getProfileInfo(req, res, next) {
    try {
      let user = await User.query().where('id', req.user.id).first();
      res.status(200).json(user);
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      next(error)
    }
  }
}
