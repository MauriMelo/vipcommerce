import Product, { IProduct } from '../models/Product';
import ProductsException from './ProductsException';
import Response from '../Response';

export default class ProductsRepository {
  static async findAll() {
    try {
      const products = await Product.findAll({
        attributes: ['nome', 'cor', 'valor', 'tamanho'],
      });
      return products;
    } catch (err) {
      console.log(err);
      throw new ProductsException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao encontrar produtos.'
      );
    }
  }

  static async create(newProduct: IProduct) {
    try {
      const { id } = (await Product.create(newProduct)) as IProduct;
      return {
        ...newProduct,
        id,
      };
    } catch (err) {
      throw new ProductsException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao criar novo produto.'
      );
    }
  }

  static async update(id: number, data: IProduct) {
    const product = await this.find(id);
    try {
      await product.update(data);
      return {
        ...data,
        id,
      };
    } catch (err) {
      throw new ProductsException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao atualizar produtos.'
      );
    }
  }

  static async find(id: number) {
    let product;
    try {
      product = (await Product.findByPk(id, {
        attributes: ['id', 'nome', 'cor', 'valor', 'tamanho'],
      })) as IProduct;
    } catch (err) {
      throw new ProductsException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao buscar produto.'
      );
    }

    if (!product) {
      throw new ProductsException(
        Response.NOT_FOUND,
        'Produto não encontrado.'
      );
    }

    return product;
  }

  static async delete(id: number) {
    const product = await this.find(id);

    try {
      await product.destroy();
      return true;
    } catch (err) {
      throw new ProductsException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao excluir produto'
      );
    }
  }
}
