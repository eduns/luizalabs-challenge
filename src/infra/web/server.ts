import express, { Express } from 'express';
import cors from 'cors';

import { setupOrderRoutes } from './routes/order-routes';
import { setupImportDataRoutes } from './routes/import-data-routes';

import ImportDataController from './controllers/import-data';
import ListOrdersController from './controllers/list-orders';

export const makeServer = (
  importDataController: ImportDataController,
  listOrdersController: ListOrdersController
): Express => {
  const server = express();

  server.use(cors());
  server.use(express.json());

  server.use(setupOrderRoutes(listOrdersController));
  server.use(setupImportDataRoutes(importDataController));

  return server;
};
