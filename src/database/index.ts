import { Sequelize } from 'sequelize';
import config from '../config/database';

class Database {
  public sequelize;

  constructor() {
    this.sequelize = new Sequelize(config);
  }
}

export default new Database();
