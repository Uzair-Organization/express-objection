import { Router } from 'express';
import user from './user.js';
import category from './category.js';
import product from './product.js';

export default () => {
	const app = Router();
	
	user(app);
    category(app);
    product(app);
	
	return app;
}