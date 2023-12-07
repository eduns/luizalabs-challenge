import request from 'supertest';

import {  makeImportDataController, makeListOrdersController } from '../../utils/factories';

import { makeServer } from '../../../src/infra/web/server';

const importDataController = makeImportDataController();
const listOrdersController = makeListOrdersController();

const server = makeServer(importDataController, listOrdersController);

describe('Order Routes', () => {
  test('should return data from orders endpoint', async () => {
    const response = await request(server)
    .get('/orders');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});