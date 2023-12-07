import { Router, Request, Response } from 'express';
import multer, { MulterError } from 'multer';
import { extname, join } from 'path';

import ImportDataController from '../controllers/import-data';

import ImportDataPresenter from '../../../presentation/controllers/import-data-presenter';

const router = Router();

const uploadHandler = multer({
  storage: multer.diskStorage({
    destination: join(__dirname, '../../uploads'),
    filename: (request, file, callback) => {
      const filename = Date.now() + '_' + 'legacy-data.txt';
      callback(null, filename);
    }
  }),
  fileFilter: (request, file, callback) => {
    if (extname(file.originalname) !== '.txt') {
      callback(new Error('File extension not allowed. Only .txt files'));
    }
    
    callback(null, true);
  }
}).single('legacyData');

export const setupImportDataRoutes = (importDataController: ImportDataController) => {
  router.post('/legacyData/upload', (request: Request, response: Response) => {
    uploadHandler(request, response, async err => {
      console.log('[Server] INFO|> Uploading...');

      if (err) {
        const origin = err instanceof MulterError ? 'Multer' : 'Server';
  
        console.error(`[Server] ERROR|> ${origin} Error:`, err.message);
  
        return response.status(400).json(ImportDataPresenter.render({
          statusCode: 400,
          body: new Error('Error on uploading file: ' + err.message)
        }));
      }

      const result = await importDataController.handle({ file: request.file });
  
      return response.status(result.statusCode).json(ImportDataPresenter.render(result));
    });
  });

  return router;
};
