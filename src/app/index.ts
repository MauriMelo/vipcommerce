import express from 'express';
import router from './routes';

export default class App {
  public server;

  constructor() {
    this.server = express();
    this.server.use(router);
  }
}
