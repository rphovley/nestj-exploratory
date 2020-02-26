import agent from '../index';

describe('AppController (e2e)', () => {
  let server;
  beforeAll(async () => {
    server = await agent();
  });

  it('/confirmation', (done) => {
    return server
        .get('/auth/me')
        .set('cookie', ['connect.sid=XIM1anaHphV6azRvYANqHp8_cpv_w9if.BsP8kO30KYZH9OfuVStkjNto4e7kteAvTJdOTTVk2uo'])
        .expect(200)
        .end(done);
  });

  afterAll(async () => {
    await server.close();
  });
});
