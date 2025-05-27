// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('404 handler', () => {
  test('should return 404 with correct error message and code', async () => {
    const res = await request(app).get('/non-existent-route');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});
