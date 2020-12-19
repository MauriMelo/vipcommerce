import Order from '../../src/app/models/Order';
import OrderItem from '../../src/app/models/OrderItem';
import Customer from '../../src/app/models/Customer';
import Product from '../../src/app/models/Product';
import database from '../../src/database';

export default async function trundace() {
  await database.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await OrderItem.destroy({ truncate: true, force: true });
  await Order.destroy({ truncate: true, force: true });
  await Customer.destroy({ truncate: true, force: true });
  await Product.destroy({ truncate: true, force: true });
  await database.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
}
