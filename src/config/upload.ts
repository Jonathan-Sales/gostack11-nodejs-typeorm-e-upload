import multer from 'multer';
import { resolve } from 'path';
import crypto from 'crypto';

const filePath = resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: filePath,
  storage: multer.diskStorage({
    destination: filePath,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const filename = `${fileHash}-${file.originalname}`;

      callback(null, filename);
    },
  }),
};
