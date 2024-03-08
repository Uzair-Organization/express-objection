import request from 'supertest';
import { app } from '../../jest.setup.js'
import httpStatus from 'http-status';

describe('User Routes', () => {
    let newUser;
    let accessToken, refreshToken;

    beforeEach(() => {
        newUser = {
            email: 'testuser1@gmail.com',
            password: "1234567890"
        };
    });
    beforeAll(async () => {
        await request(app).post('/user/signup').send({
            email: 'testuser@gmail.com',
            password: '1234567890'
        });
        const loginRes = await request(app).post('/user/login').send({
            email: 'testuser@gmail.com',
            password: '1234567890'
        }).expect(httpStatus.OK);

        accessToken = loginRes.body.accessToken;
        refreshToken = loginRes.body.refreshToken;
    });

    test('should return 201 and successfully register user if request data is ok', async () => {
        const res = await request(app).post('/user/signup').send(newUser).expect(httpStatus.CREATED);
        expect(res.body).toEqual({
            success: true,
            message: "User created successfully!"
        });
    });

    test('should return 400 error if email is invalid', async () => {
        newUser.email = 'invalidEmail';

        await request(app).post('/user/signup').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 200 if email and password are correct', async () => {

        await request(app).post('/user/login').send({
            email: 'testuser@gmail.com',
            password: "1234567890"
        }).expect(httpStatus.OK);
    });

    test('should return 200 if email and password are correct', async () => {

        let res = await request(app).post('/user/login').send({
            email: 'testuser@gmail.com',
            password: "1234567890"
        }).expect(httpStatus.OK);

        expect(res.body).toEqual({
            userInfo: {
                id: expect.anything(),
                email: 'testuser@gmail.com'
            },
            accessToken: expect.anything(),
            refreshToken: expect.anything()
        });
    });

    test('should return 200 if token provided', async () => {
        await request(app).get('/user/profile').set('Authorization', `Bearer ${accessToken}`).expect(httpStatus.OK);
    });
    test('should return 401 if no token is provided', async () => {
        await request(app).get('/user/profile').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 if an invalid token is provided', async () => {
        await request(app).get('/user/profile').set('Authorization', 'Bearer invalidToken').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 if valid token is provided', async () => {
        const refreshRes = await request(app).post('/user/refresh_token').send({
            refreshToken
        }).expect(httpStatus.OK);

        expect(refreshRes.body).toEqual({
            userInfo: {
                id: expect.anything(),
                email: expect.anything()
            },
            accessToken: expect.anything(),
            refreshToken: expect.anything()
        });
    })

    test('should return error if token invalid', async () => {
        const refreshRes = await request(app).post('/user/refresh_token').send({
            refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiIiwiaWF0IjoxNzA5MTkwNjQwLCJleHAiOjE3MDkyNzcwNDB9.nW3Eth12OFG-qv-mMe7kDsg8vKkBkXmT9i1JlF0Gq"
        }).expect(httpStatus.FORBIDDEN);

        expect(refreshRes.body).toEqual({
            success: false,
            message: "Unauthorized! refresh token has been expired"
        });
    })

    test('should return 200 if valid token is provided for logout', async () => {
        const refreshRes = await request(app).post('/user/logout').set('Authorization', `Bearer ${accessToken}`).expect(httpStatus.OK);

        expect(refreshRes.body).toEqual({
            success: true,
            message: "Logged-out successfully!"
        });
    })

    test('should return 401 if token is not provided', async () => {
        await request(app).post('/user/logout').expect(httpStatus.UNAUTHORIZED);
    })
})