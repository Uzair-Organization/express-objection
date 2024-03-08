import { Model } from 'objection';

export default class User extends Model {
    static get tableName() {
        return 'user';
    }

    static get jsonSchema() {
        return {
            type: 'object',
        };
    }

    $formatJson(json) {
        json = super.$formatJson(json);
        delete json.hashedPassword;
        delete json.hashed_password;
        delete json.salt;
        return json;
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
