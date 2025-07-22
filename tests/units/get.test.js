// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
// const { Fragment } = require('../../src/model/fragment');

// Helper auth credentials
const authUser = { email: 'user1@email.com', password: 'password1' };

describe('GET /v1/fragments', () => {
  let fragmentId;

  beforeAll(async () => {
    // Create a test fragment for the authenticated user
    const res = await request(app)
      .post('/v1/fragments')
      .auth(authUser.email, authUser.password)
      .set('Content-Type', 'text/plain')
      .send('Hello world');

    console.log('Created fragment:', res.body);
    expect(res.statusCode).toBe(201);
    fragmentId = res.body.fragment.id;
  });

  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
  test('authenticated users get full fragment metadata with expand=1', async () => {
    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth(authUser.email, authUser.password);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);

    const fragment = res.body.fragments.find((f) => f.id === fragmentId);
    expect(fragment).toHaveProperty('id');
    expect(fragment).toHaveProperty('type', 'text/plain');
    expect(fragment).toHaveProperty('size');
    expect(fragment).toHaveProperty('created');
    expect(fragment).toHaveProperty('updated');
  });

  test('GET /v1/fragments/:id/info for invalid ID returns 404', async () => {
    const res = await request(app)
      .get('/v1/fragments/does-not-exist/info')
      .auth(authUser.email, authUser.password);

    expect(res.statusCode).toBe(404);
  });
});
