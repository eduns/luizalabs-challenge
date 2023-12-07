import ImportData from '../../src/domain/usecases/import-data';
import ListOrders from '../../src/domain/usecases/list-orders';

import ImportDataController from '../../src/infra/web/controllers/import-data';
import ListOrdersController from '../../src/infra/web/controllers/list-orders';

import InMemoryLegacyDataRepository from './repositories/InMemoryLegacyDataRepository';
import InMemoryOrderRepository from './repositories/InMemoryOrderRepository';

import ImportDataParamsValidator from '../../src/infra/web/validators/import-data-params';
import ListOrdersParamsValidator from '../../src/infra/web/validators/list-orders-params';

const makeImportDataUseCase = () => {
  return new ImportData(new InMemoryLegacyDataRepository());
};

const makeListOrdersUseCase = () => {
  return new ListOrders(new InMemoryOrderRepository());
};

const makeImportDataController = () => {
  return new ImportDataController(new ImportData(new InMemoryLegacyDataRepository()), new ImportDataParamsValidator());
};
const makeListOrdersController = () => {
  return new ListOrdersController(new ListOrders(new InMemoryOrderRepository()), new ListOrdersParamsValidator());
};

export {
  makeImportDataUseCase,
  makeListOrdersUseCase,
  makeImportDataController,
  makeListOrdersController
};