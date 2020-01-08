import serverApi             from './server';
import supertest             from 'supertest';

export default async function load() {
  const app = await serverApi();
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  return supertest.agent(app.getHttpServer());
};
