import request from 'supertest';
import { app } from '../../jest.setup.js'
import httpStatus from 'http-status';

describe('Category Routes', () => {
    let accessToken, categoryId;

    beforeAll(async () => {
        await request(app).post('/user/signup').send({
            email: 'testcatuser@gmail.com',
            password: '1234567890'
        }).expect(httpStatus.CREATED);
        const loginRes = await request(app).post('/user/login').send({
            email: 'testcatuser@gmail.com',
            password: '1234567890'
        }).expect(httpStatus.OK);

        accessToken = loginRes.body.accessToken;
        const createCategoryRes = await request(app)
            .post('/category')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name: 'TestCategory', description: 'Test Description' })
        categoryId = createCategoryRes.body.id
    });

    test('should create a new category with valid token', async () => {
        const createCategoryRes = await request(app)
            .post('/category')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name: 'TestCategory', description: 'Test Description' })
            .expect(httpStatus.CREATED);

        expect(createCategoryRes.body).toEqual(expect.any(Object));;
    });

    test('should get all categories', async () => {
        const getCategoriesRes = await request(app)
            .get('/category?page=1&limit=10')
            .expect(httpStatus.OK);
        expect(getCategoriesRes.body).toEqual(expect.any(Array));
    });

    test('should get a category by ID with valid token', async () => {

        const getCategoryRes = await request(app)
            .get(`/category/${categoryId}`)
            .expect(httpStatus.OK);
        expect(getCategoryRes.body).toEqual(expect.any(Object));
    });

    test('should update a category by ID with valid token', async () => {

        const updateCategoryRes = await request(app)
            .put(`/category/${categoryId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ name: 'UpdatedCategory', description: 'Updated Description' });

        expect(updateCategoryRes.body).toEqual(expect.any(Object));
    });

    test('should delete a category by ID with valid token', async () => {
        await request(app)
            .delete(`/category/${categoryId}`)
            .set('Authorization', `Bearer ${accessToken}`);
    });
});
