import { DataTypes, Model } from 'sequelize';
import database from '../../database';

export interface IProduct extends Model {
  id: number;
  nome: string;
  cor: string;
  tamanho: string;
  valor: number;
}

// And with a functional approach defining a module looks like this
const Product = database.sequelize.define(
  'Product',
  {
    nome: {
      type: new DataTypes.STRING(),
    },
    cor: {
      type: new DataTypes.STRING(),
    },
    tamanho: {
      type: new DataTypes.STRING(50),
    },
    valor: {
      type: new DataTypes.FLOAT(10, 2),
    },
  },
  {
    tableName: 'products',
    paranoid: true,
  }
);

export default Product;
