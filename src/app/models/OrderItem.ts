import { DataTypes, Model } from 'sequelize';
import database from '../../database';
import Product from './Product';

export interface IOrderItem extends Model {
  id_pedido: number;// eslint-disable-line
  id_produto: number;// eslint-disable-line
  quantidade: string;
}

// And with a functional approach defining a module looks like this
const OrderItem = database.sequelize.define(
  'OrderItem',
  {
    quantidade: {
      type: new DataTypes.NUMBER(),
    },
  },
  {
    tableName: 'order_items',
    timestamps: false,
  }
);

OrderItem.belongsTo(Product, {
  foreignKey: 'id_produto',
  as: 'product',
});

export default OrderItem;
