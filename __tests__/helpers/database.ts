import Customer from '../../src/app/models/Customer';
import Product from '../../src/app/models/Product';

const models = [Product, Customer];

export default function trundace() {
  return Promise.all(
    models.map((m) => m.destroy({ truncate: true, force: true }))
  );
}
