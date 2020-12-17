import { DataTypes } from 'sequelize';
import database from '../../database';

// And with a functional approach defining a module looks like this
const Product = database.sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: new DataTypes.STRING(64),
    },
  },
  {
    tableName: 'products',
  }
);

export default Product;
