import { Model } from 'objection';
import Category from './category.js';
import ProductImage from './productImage.js';

export default class Product extends Model {
  static get tableName() {
    return 'product';
  }

  static get jsonSchema() {
    return {
      type: 'object'
    };
  }
  static get relationMappings() {
    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: 'product.category_id',
          to: 'category.id',
        },
      },
      productImages: {
        relation: Model.HasManyRelation,
        modelClass: ProductImage,
        join: {
          from: 'product.id',
          to: 'product_image.product_id',
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
