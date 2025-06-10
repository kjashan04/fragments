const request = require('supertest');
const express = require('express');
const routes = require('../../src/routes/api');
//const { Fragment } = require('../../model/fragment');

// --- SETUP MOCK SERVER ---
const createTestApp = (withAuth = true) => {
  const app = express();

  if (withAuth) {
    app.use((req, res, next) => {
      req.user = 'test-user'; // mock authenticated user
      next();
    });
  }

  app.use('/v1', routes);
  return app;
};

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', async () => {
    const unauthApp = createTestApp(false); // No auth middleware

    const res = await request(unauthApp)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send('Hello World');

    expect(res.status).toBe(401); // your post.js should handle this
  });

  test('authenticated user can create a text/plain fragment', async () => {
    const app = createTestApp();

    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send('Hello World');

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.body.fragment.size).toBe(11);
    expect(res.headers.location).toMatch(/\/v1\/fragments\/.+/);
  });

  test('returns 415 for unsupported content types', async () => {
    const app = createTestApp();

    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ hello: 'world' }));

    expect(res.status).toBe(415);
  });
});
