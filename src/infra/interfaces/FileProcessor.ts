export type FileData = {
  userId: number;
  userName: string;
  orderId: number;
  orderDate: string;
  productId: number;
  productValue: number;
}

interface FileProcessor {
  processFile (file: Buffer): Promise<FileData[]>
}

export default FileProcessor;