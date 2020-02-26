import agent from '../index';

describe('AppController (e2e)', () => {
  let server;
  beforeAll(async () => {
    server = await agent();
  });

  it('/login', (done) => {
    return server
        .post('/auth/login')
        .set('cookie', ['connect.sid=XIM1anaHphV6azRvYANqHp8_cpv_w9if.BsP8kO30KYZH9OfuVStkjNto4e7kteAvTJdOTTVk2uo'])
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
