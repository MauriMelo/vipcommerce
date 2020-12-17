import express from 'express';
import database from '../database';
import router from './routes';

export default class App {
  public server;

  public database;

  constructor() {
    this.server = express();
    this.database = database;
    this.server.use(router);
  }
}
