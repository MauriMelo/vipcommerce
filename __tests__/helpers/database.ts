import Product from '../../src/app/models/Product';

const models = [Product];

export default function trundace() {
  return Promise.all(
    models.map((m) => m.destroy({ truncate: true, force: true }))
  );
}
