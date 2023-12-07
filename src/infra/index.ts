
import ImportData from '../domain/usecases/import-data';
import ListOrders from '../domain/usecases/list-orders';

import ImportDataController from '../infra/web/controllers/import-data';
import ListOrdersController from '../infra/web/controllers/list-orders';

import ImportDataValidator from '../infra/web/validators/import-data-params';
import ListOrdersValidator from '../infra/web/validators/list-orders-params';

import LegacyDataRepositoryPostgres from '../infra/database/repositories/LegacyDataRepositoryPostgres';
import OrderRepositoryPostgres from '../infra/database/repositories/OrderRepositoryPostgres';

import { makeServer } from './web/server';
import { pool } from './database';

const orderRepository = new OrderRepositoryPostgres(pool);
const legacyDataRepository = new LegacyDataRepositoryPostgres(pool);

const importDataController = new ImportDataController(new ImportData(legacyDataRepository), new ImportDataValidator());
const listOrdersController = new ListOrdersController(new ListOrders(orderRepository), new ListOrdersValidator());

const server = makeServer(importDataController, listOrdersController);
  
const port = parseInt(process.env.PORT as string) || 8080;

server.listen(port, () => {
  console.log(`[SERVER] INFO|> Server running at port ${port}`);
});