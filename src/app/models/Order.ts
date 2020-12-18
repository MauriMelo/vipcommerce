import { DataTypes, Model } from 'sequelize';
import database from '../../database';
import Customer from './Customer';
import OrderItem, { IOrderItem } from './OrderItem';

export interface IOrder extends Model {
  id: number;
  id_cliente: number; // eslint-disable-line
  data: string;
  items: Array<IOrderItem>;
  observacao: string;
  forma_pagamento: number; // eslint-disable-line
}

// And with a functional approach defining a module looks like this
const Order = database.sequelize.define(
  'Order',
  {
    data: {
      type: new DataTypes.STRING(),
    },
    observacao: {
      type: new DataTypes.STRING(50),
    },
    forma_pagamento: {
      type: new DataTypes.FLOAT(10, 2),
    },
  },
  {
    tableName: 'orders',
    paranoid: true,
  }
);

Order.belongsTo(Customer, {
  foreignKey: 'id_cliente',
  as: 'customer',
});

Order.hasMany(OrderItem, {
  as: 'items',
  foreignKey: 'id_pedido',
});

export default Order;
