import { createUploadHandler } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createUploadHandler();
