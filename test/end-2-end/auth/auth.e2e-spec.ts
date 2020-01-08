import agent from '../index';

describe('AppController (e2e)', () => {

  let server;
  beforeAll(async () => {
    server = await agent();
  });

  it('/login', (done) => {
    return server
        .post('/auth/login')
        .send({ password: 'dev', username: 'dev@dev.com' })
        .expect(200)
        .end(done);
  });

  it('/confirmation', (done) => {
    return server
        .get('/user/confirmation/2626')
        .expect(200)
        .end(done);
  });

  afterAll(async () => {
    await server.close();
  });
});
