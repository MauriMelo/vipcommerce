import Products from '../models/Products';
import ProductsException from './ProductsException';
import Response from '../Response';

export default class ProductsRepository {
  static async findAll() {
    try {
      const products = await Products.findAll();
      return products;
    } catch (err) {
      throw new ProductsException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao encontrar produtos.'
      );
    }
  }
}
