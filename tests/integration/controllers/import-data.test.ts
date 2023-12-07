import fs from 'fs/promises';

import { makeImportDataController } from '../../utils/factories';

import FileProcessor from '../../../src/infra/file-processor/file-processor';

describe('ImportData Controller', () => {
  it('should return an error if file param is missing', async () => {
    const controller = makeImportDataController();

    const result = await controller.handle({ file: null });

    expect(result.statusCode).toBe(400);
    expect(result.body.message).toBe('Param file is required');
  });
  
  it('should return the data of a processed file', async () => {
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
    jest.spyOn(fs, 'unlink').mockImplementationOnce(async () => {});

    const controller = makeImportDataController();

    const result = await controller.handle({ file: Buffer.from('') });

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual([{
      userId: 1,
      userName: 'foo',
      orderId: 1,
      productId: 1,
      productValue: 100,
      orderDate: '2021-12-01'
    }]);
  });

  it('should return an error of a internal server error', async () => {
    jest.spyOn(FileProcessor.prototype, 'processFile')
      .mockImplementationOnce(() => {
        throw new Error('internal server error');
      });

    jest.mock('fs/promises');
    jest.spyOn(fs, 'unlink').mockImplementationOnce(async () => {});

    const controller = makeImportDataController();

    const result = await controller.handle({ file: Buffer.from('') });

    expect(result.statusCode).toBe(500);
    expect(result.body.message).toEqual('internal server error');
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});