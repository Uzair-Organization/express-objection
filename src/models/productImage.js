import { Model } from 'objection';
import Product from './product.js';

export default class ProductImage extends Model {
  static get tableName() {
    return 'product_image';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
      },
    };
  }

  static get relationMappings() {
    return {
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'product_image.product_id',
          to: 'product.id',
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
