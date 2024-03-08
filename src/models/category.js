import { Model } from 'objection';
import Product from './product.js';

export default class Category extends Model {
    static get tableName() {
        return 'category';
    }

    static get jsonSchema() {
        return {
            type: 'object'
        };
    }

    static get relationMappings() {
        return {
            parentCategory: {
                relation: Model.BelongsToOneRelation,
                modelClass: Category,
                join: {
                    from: 'category.parent_category_id',
                    to: 'category.id',
                },
            },
            subCategories: {
                relation: Model.HasManyRelation,
                modelClass: Category,
                join: {
                    from: 'category.id',
                    to: 'category.parent_category_id',
                },
            },
            products: {
                relation: Model.HasManyRelation,
                modelClass: Product,
                join: {
                    from: 'category.id',
                    to: 'product.category_id',
                },
            },
        };
    }

    static get modifiers() {
        return {
            orderDescending: (query) => {
                query.orderBy('createdAt', 'desc');
            },
        };
    }

    $beforeInsert() {
        const currentDate = new Date().toISOString();
        this.createdAt = currentDate;
        this.updatedAt = currentDate;
    }

    $beforeUpdate() {
        this.updatedAt = new Date().toISOString();
    }
}
