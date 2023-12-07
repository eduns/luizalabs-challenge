import request from 'supertest';
import fs from 'fs/promises';

import FileProcessor from '../../../src/infra/file-processor/file-processor';

import { makeImportDataController, makeListOrdersController } from '../../utils/factories';

import { makeServer } from '../../../src/infra/web/server';

jest.spyOn(FileProcessor.prototype, 'processFile')
  .mockImplementationOnce(() => {
    return Promise.resolve([{
      userId: 1,
      userName: 'foo',
      orderId: 1,
      productId: 1,
      productValue: 100,
      orderDate: '2021-12-01'
    }]);
  });
  
jest.mock('fs/promises');
jest.spyOn(fs, 'unlink').mockImplementation(async () => {});

const importDataController = makeImportDataController();
const listOrdersController = makeListOrdersController();

const server = makeServer(importDataController, listOrdersController);

describe('Import Data Routes', () => {
  test('should return a status code 200 from import data endpoint', async () => {
    const response = await request(server)
    .post('/legacyData/upload')
    .attach('legacyData', Buffer.from('...'), 'test.txt');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Successful Upload');
  });

  test('should return en error if file extension is not .txt', async () => {
    const response = await request(server)
    .post('/legacyData/upload')
    .attach('legacyData', Buffer.from('...'), 'test.jpg');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Error on uploading file: File extension not allowed. Only .txt files');
  });

  test('should return en error if file extension is not attached', async () => {
    const response = await request(server)
    .post('/legacyData/upload');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Param file is required');
  });

  test('should return en error of a internal server error', async () => {
    const response = await request(server)
    .post('/legacyData/upload')
    .attach('legacyData', Buffer.from(''), 'test.txt');

    expect(response.statusCode).toBe(500);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});