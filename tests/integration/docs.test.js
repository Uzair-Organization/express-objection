import request from 'supertest';
import httpStatus from 'http-status';
import { app } from '../../jest.setup.js'

describe('Auth routes', () => {
  describe('GET /api-docs', () => {
    test('', async () => {
      await request(app)
        .get('/api-docs')
        .send()
        .expect(httpStatus.MOVED_PERMANENTLY);
    }, 30000);
  });
});
