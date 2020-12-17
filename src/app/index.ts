import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import database from '../database';
import router from './routes';

class App {
  public server;

  public database;

  constructor() {
    this.server = express();
    this.database = database;
    this.server.use(bodyParser.json());
    this.server.use(router);
    this.handleException();
  }

  handleException() {
    this.server.use((err: string, req: Request, res: Response, next: any) => {
      res.status(500).json({
        error: 'Falha ao processar requisição',
      });
      next();
    });
  }
}

export default new App();
