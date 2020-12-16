import express from 'express';

export default class App {
  public server;

  constructor() {
    this.server = express();
  }
}
