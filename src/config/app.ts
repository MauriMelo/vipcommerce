import path from 'path';

export default {
  hostname: `http://localhost:${process.env.PORT}`,
  pdfDir: path.resolve(__dirname, '../public'),
};
