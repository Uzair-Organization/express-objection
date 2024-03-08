import accountSchemas from '../../src/middlewares/validators/general/account.js'
import categorySchemas from '../../src/middlewares/validators/category.js';

describe('Joi Validation Schemas', () => {
    test('should pass validation for a valid user creation request', () => {
        const validUser = {
            email: 'test@example.com',
            password: 'password123',
            phone: '1234567890',
        };

        const result = accountSchemas.createUser.body.validate(validUser);
        expect(result.error).toBeUndefined();
    });

    test('should fail validation for an invalid user creation request', () => {
        const invalidUser = {
            email: 'invalid-email',
            password: 'short',
            phone: '123',
        };

        const result = accountSchemas.createUser.body.validate(invalidUser);
        expect(result.error).not.toBeUndefined();
    });

    test('should pass validation for a valid login request', () => {
        const validLogin = {
            email: 'test@example.com',
            password: 'password123',
        };

        const result = accountSchemas.loginUser.body.validate(validLogin);
        expect(result.error).toBeUndefined();
    });

    test('should fail validation for an invalid login request', () => {
        const invalidLogin = {
            email: 'invalid-email',
            password: 'short',
        };

        const result = accountSchemas.loginUser.body.validate(invalidLogin);
        expect(result.error).not.toBeUndefined();
    });

    test('should pass validation for a valid refresh token request', () => {
        const validRefreshToken = {
            refreshToken: 'validToken123',
        };

        const result = accountSchemas.refreshToken.body.validate(validRefreshToken);
        expect(result.error).toBeUndefined();
    });

    test('should fail validation for an invalid refresh token request', () => {
        const invalidRefreshToken = {
            refreshToken: 'short',
        };

        const result = accountSchemas.refreshToken.body.validate(invalidRefreshToken);
        expect(result.error).not.toBeUndefined();
    });
});


// Category schema

describe('Category Validation Schemas', () => {
    test('should pass validation for a valid create category request', () => {
        const validCreateCategory = {
            name: 'TestCategory',
            description: 'Test Description',
            parentCategoryId: 1,
            products: [
                {
                    title: 'Product 1',
                    description: 'Product 1 Description',
                    inStock: true,
                    price: 19.99,
                    sku: 'ABC123'
                }
            ]
        };

        const result = categorySchemas.createCategory.body.validate(validCreateCategory);
        expect(result.error).toBeUndefined();
    });

    test('should fail validation for an invalid create category request', () => {
        const invalidCreateCategory = {
            name: '',
            description: 'Test Description',
            parentCategoryId: 'invalidId',
            products: [
                {
                    title: 'Product 1',
                    description: 'Product 1 Description',
                    inStock: true,
                    price: 19.99,
                    sku: 'ABC123'
                }
            ]
        };

        const result = categorySchemas.createCategory.body.validate(invalidCreateCategory);
        expect(result.error).not.toBeUndefined();
    });

    test('should pass validation for a valid update category request', () => {
        const validUpdateCategory = {
            id: 1,
            name: 'Updated Category',
            description: 'Updated Description',
            parentCategoryId: 2,
            products: [
                {
                    id: 1,
                    title: 'Updated Product',
                    description: 'Updated Product Description',
                    inStock: true,
                    price: 29.99,
                    sku: 'XYZ456',
                    categoryId: 1,
                    createdAt: '2024-03-06T05:53:35.978Z',
                    updatedAt: '2024-03-06T05:53:35.978Z'
                }
            ],
            createdAt: '2024-03-06T05:53:35.899Z',
            updatedAt: '2024-03-06T05:53:35.899Z'
        };

        const result = categorySchemas.updateCategory.body.validate(validUpdateCategory);
        expect(result.error).toBeUndefined();
    });

    test('should fail validation for an invalid update category request', () => {
        const invalidUpdateCategory = {
            id: 'invalidId',
            name: 'Updated Category',
            description: 'Updated Description',
            parentCategoryId: 2,
            products: [
                {
                    id: 'invalidProductId',
                    title: 'Updated Product',
                    description: 'Updated Product Description',
                    inStock: true,
                    price: 29.99,
                    sku: 'XYZ456',
                    categoryId: 1,
                    createdAt: '2024-03-06T05:53:35.978Z',
                    updatedAt: '2024-03-06T05:53:35.978Z'
                }
            ],
            createdAt: '2024-03-06T05:53:35.899Z',
            updatedAt: '2024-03-06T05:53:35.899Z'
        };

        const result = categorySchemas.updateCategory.body.validate(invalidUpdateCategory);
        expect(result.error).not.toBeUndefined();
    });

    test('should pass validation for a valid getCategoryById request', () => {
        const validGetCategoryById = {
            id: '1'
        };

        const result = categorySchemas.getCategoryById.params.validate(validGetCategoryById);
        expect(result.error).toBeUndefined();
    });

    test('should fail validation for an invalid getCategoryById request', () => {
        const invalidGetCategoryById = {
            id: 'invalidId'
        };

        const result = categorySchemas.getCategoryById.params.validate(invalidGetCategoryById);
        expect(result.error).not.toBeUndefined();
    });

    test('should pass validation for a valid deleteCategoryById request', () => {
        const validDeleteCategoryById = {
            id: '1'
        };

        const result = categorySchemas.deleteCategoryById.params.validate(validDeleteCategoryById);
        expect(result.error).toBeUndefined();
    });

    test('should fail validation for an invalid deleteCategoryById request', () => {
        const invalidDeleteCategoryById = {
            id: 'invalidId'
        };

        const result = categorySchemas.deleteCategoryById.params.validate(invalidDeleteCategoryById);
        expect(result.error).not.toBeUndefined();
    });

    test('should pass validation for a valid getAllCategories request', () => {
        const validGetAllCategories = {
            page: 1,
            limit: 10
        };

        const result = categorySchemas.getAllCategories.query.validate(validGetAllCategories);
        expect(result.error).toBeUndefined();
    });

    test('should fail validation for an invalid getAllCategories request', () => {
        const invalidGetAllCategories = {
            page: 'invalidPage',
            limit: 'invalidLimit'
        };

        const result = categorySchemas.getAllCategories.query.validate(invalidGetAllCategories);
        expect(result.error).not.toBeUndefined();
    });
});

