import fs from 'fs';
import readline from 'readline';

import FileProcessor, { FileData } from '../interfaces/FileProcessor';

export default class FileProcessorStream implements FileProcessor {
  processFile (file: Buffer): Promise<FileData[]> {
    const readStream = fs.createReadStream(file, { encoding: 'utf8' });
    const lineReader = readline.createInterface({ input: readStream });

    const data: FileData[] = [];

    return new Promise((resolve, reject) => {
      lineReader.on('line', (line) => {
        console.log('[FileProcessor] INFO|> Line:', line);

        const userId = parseInt(line.substring(0, 10));
        const userName = line.substring(10, 55).trimStart();
        const orderId = parseInt(line.substring(55, 65));
        const productId = parseInt(line.substring(65, 75));
        const productValue = parseFloat(line.substring(75, 87).trimStart());
        const purchaseDate = line.substring(87);
        const orderDate = `${purchaseDate.substring(0, 4)}-${purchaseDate.substring(4, 6)}-${purchaseDate.substring(6)}`;

        data.push({ userId, userName, orderId, productId, productValue, orderDate });
      });

      lineReader.on('error', (err) => {
        console.error('[FileProcessor] ERROR|>', err.message);
        reject(err);
      });

      lineReader.on('close', () => {
        console.log('[FileProcessor] INFO|> Reading Complete!');
        resolve(data);
      });
    });
  }
}