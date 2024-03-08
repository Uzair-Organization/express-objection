import Product from "../models/product.js";

export default class ProductService {
    async getAllProducts(req, res, next) {
        try {
            const products = await Product.query();
            res.status(200).json({ success: true, products });
        } catch (error) {
            next(error)
        }
    }

    async getProductById(req, res, next) {
        try {
            const { id } = req.params;
            const product = await Product.query().where({ id: id }).first();

            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            res.status(200).json({ success: true, product });
        } catch (error) {
            next(error)
        }
    }

    async createProduct(req, res, next) {
        try {
            const { title, description, inStock, price, sku, categoryId } = req.body;

            const product = await Product.query().insert({ title, description, inStock, price, sku, categoryId });

            res.status(201).json({ success: true, product });
        } catch (error) {
            next(error)
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedProduct = await Product.query().patchAndFetchById(id, data);

            res.status(200).json({ success: true, updatedProduct });
        } catch (error) {
            next(error)
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            await Product.query().deleteById(id);

            res.status(200).json({ success: true, message: 'Product deleted successfully' });
        } catch (error) {
            next(error)
        }
    }
}