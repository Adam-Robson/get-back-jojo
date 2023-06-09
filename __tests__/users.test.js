const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Dummy user for testing
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '123456',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? testUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...testUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('POST / creates a new user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send(testUser);
    const { firstName, lastName, email } = testUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('POST /sessions signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(testUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@example.com', password: '123456' });
    expect(res.status).toEqual(200);
  });

  it('GET /protected should return a 401 if not authenticated', async () => {
    const res = await request(app)
      .get('/api/v1/users/protected');
    expect(res.status).toEqual(401);
  });

  it('GET /protected should return the current user if authenticated', async () => {
    const [agent] = await registerAndLogin({ ...testUser });
    const res = await agent.get('/api/v1/users/protected');
    expect(res.status).toEqual(200);
  });

  it('GET /users should return 401 if user not admin', async () => {
    const agent = request.agent(app);
    await UserService.create({ ...testUser });
    await agent.post('/api/v1/users/sessions').send({ email: 'Test', password: '123456' });
    const res = await agent
      .get('/api/v1/users');
    expect(res.statusCode).toEqual(401);
  });

  it('/users should return a 200 if user is admin', async () => {
    const [agent] = await registerAndLogin({ email: 'admin@example.com', password: '123456' });
    const res = await agent
      .get('/api/v1/users');
    expect(res.status).toEqual(200);
  });

  it('DELETE /sessions deletes the user session', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.delete('/api/v1/users/sessions');
    expect(resp.status).toBe(204);
  });
});
