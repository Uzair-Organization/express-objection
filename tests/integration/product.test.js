import httpStatus from 'http-status';
import request from 'supertest';
import { app } from '../../jest.setup.js';

describe('Product Routes', () => {
  let accessToken, id, categoryId;

  beforeAll(async () => {
    await request(app).post('/user/signup').send({
      email: 'testproduser@gmail.com',
      password: '1234567890'
    }).expect(httpStatus.CREATED);
    const loginRes = await request(app).post('/user/login').send({
      email: 'testproduser@gmail.com',
      password: '1234567890'
    }).expect(httpStatus.OK);

    accessToken = loginRes.body.accessToken;


    const createCategoryRes = await request(app)
      .post('/category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Test Category', description: 'Test Description' })
    categoryId = createCategoryRes.body.id


    const createProductRes = await request(app)
      .post('/product')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Product',
        description: 'Test Description',
        inStock: true,
        price: 19.99,
        sku: 'TEST123',
        categoryId: categoryId,
      })
      .expect(httpStatus.CREATED);

    id = createProductRes.body.product.id;
  });

  test('should get all products', async () => {
    const getProductsRes = await request(app)
      .get('/product')
      .expect(httpStatus.OK);

    expect(getProductsRes.body.products).toEqual(expect.any(Array));
  });

  test('should get a product by ID with valid token', async () => {
    const getProductRes = await request(app)
      .get(`/product/${id}`)
      .expect(httpStatus.OK);

    expect(getProductRes.body).toEqual(expect.any(Object));
  });

  test('should create a new product with valid token', async () => {
    const createProductRes = await request(app)
      .post('/product')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'TestProduct2',
        description: 'Test Description 2',
        inStock: true,
        price: 29.99,
        sku: 'TEST456',
        categoryId: categoryId,
      })
      .expect(httpStatus.CREATED);

    expect(createProductRes.body).toEqual(expect.any(Object));
  });

  test('should update a product by ID with valid token', async () => {
    const updateProductRes = await request(app)
      .put(`/product/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'UpdatedProduct',
        description: 'Updated Description',
        inStock: true,
        price: 39.99,
        sku: 'UPDATED123',
        categoryId: categoryId,
      })

    expect(updateProductRes.body).toEqual(expect.any(Object));
  });

  test('should delete a product by ID with valid token', async () => {
    await request(app)
      .delete(`/product/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK);
  });
});
