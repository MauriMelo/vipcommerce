import { DataTypes, Model } from 'sequelize';
import database from '../../database';

export interface ICustomer extends Model {
  id: number;
  nome: string;
  cpf: string;
  sexo: string;
  email: number;
}

// And with a functional approach defining a module looks like this
const Customer = database.sequelize.define(
  'Customer',
  {
    nome: {
      type: new DataTypes.STRING(),
    },
    cpf: {
      type: new DataTypes.STRING(11),
    },
    sexo: {
      type: new DataTypes.CHAR(1),
    },
    email: {
      type: new DataTypes.STRING(100),
    },
  },
  {
    tableName: 'customers',
    paranoid: true,
  }
);

export default Customer;
