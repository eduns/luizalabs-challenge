import { Router, Request, Response } from 'express';

import ListOrdersPresenter from '../../../presentation/controllers/list-orders-presenter';

import ListOrdersController from '../controllers/list-orders';

const router = Router();

export const setupOrderRoutes = (listOrdersController: ListOrdersController) => {
  router.get('/orders', async (request: Request, response: Response) => {
    const result = await listOrdersController.handle(request.query);
  
    return response.status(result.statusCode).json(ListOrdersPresenter.render(result));
  });
  
  return router;
};

