import Category from "../models/category.js";
import { publishMessage } from "../utils/helper/rabbitmq.js";
import client from '../utils/helper/redis.js';

export default class CategoryService {
    async getAllCategories(req, res, next) {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            let lastUpdateTime;

            const categories = await Category.query()
                .withGraphJoined('[products, subCategories.[products]]')
                .whereNull('category.parentCategoryId')
                .orderBy('createdAt', 'desc')
                .modifyGraph('subcategories', builder => {
                    builder.orderBy('createdAt', 'desc');
                })
                .page(page - 1, limit);

            lastUpdateTime = await client.get('lastUpdateTime')

            res.status(200).json({ categories, lastUpdateTime });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    async getCategoryById(req, res, next) {
        try {
            const { id } = req.params;
            const category = await Category.query().findById(id);

            res.status(200).json(category);
        } catch (error) {
            next(error)
        }
    }

    async createCategory(req, res, next) {
        try {
            const data = req.body;
            const newCategory = await Category.query().insertGraph(data);

            // 1- app Name 2- message 3- routing key 4- queue 5- exchange tye
            await publishMessage(JSON.stringify(newCategory), "category.info", "category", "direct")

            res.status(201).json(newCategory);
        } catch (error) {
            next(error)
        }
    }

    async updateCategory(req, res, next) {
        try {
            const data = req.body;

            const updatedCategory = await Category.query().upsertGraph(data, {
                relate: true,
                noDelete: true
            })

            const currentTime = new Date().toISOString();

            await client.set('lastUpdateTime', currentTime)

            res.status(200).json(updatedCategory);
        } catch (error) {
            next(error)
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            await Category.query().deleteById(id);
            res.status(200).json({ success: true, message: 'Category deleted successfully' });
        } catch (error) {
            next(error)
        }
    }
}