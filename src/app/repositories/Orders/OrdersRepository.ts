import { number } from 'yup/lib/locale';
import OrdersException from './OrdersException';
import Response from '../../Response';
import Order, { IOrder } from '../../models/Order';
import CustomerRepository from '../Customers/CustomersRepository';
import OrderItem, { IOrderItem } from '../../models/OrderItem';
import Product from '../../models/Product';

export default class OrdersRepository {
  static async findAll() {
    try {
      const orders = await Order.findAll({
        attributes: ['id', 'data', 'observacao', 'forma_pagamento'],
        include: [
          {
            association: 'customer',
            attributes: ['id', 'nome', 'email', 'cpf', 'sexo'],
          },
          {
            association: 'items',
            attributes: ['quantidade'],
            include: [
              {
                association: 'product',
                attributes: ['id', 'nome', 'cor', 'valor', 'tamanho'],
              },
            ],
          },
        ],
      });
      return orders;
    } catch (err) {
      throw new OrdersException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao encontrar pedidos.'
      );
    }
  }

  static removeDuplicates(items: IOrderItem[]) {
    const ids: number[] = [];
    return items.filter((i) => {
      if (ids.indexOf(i.id_produto) === -1) {
        ids.push(i.id_produto);
        return true;
      }
      return false;
    });
  }

  static async create(newOrder: IOrder) {
    // busca pelo cliente se não existir então dispara exception
    await CustomerRepository.find(newOrder.id_cliente);

    const { count } = await Product.findAndCountAll({
      where: {
        id: newOrder.items.map((i) => i.id_produto),
      },
    });

    // verifica se todos os produtos incluidos estão cadastrados
    if (count !== OrdersRepository.removeDuplicates(newOrder.items).length) {
      throw new OrdersException(
        Response.BAD_REQUEST,
        'Produto incluido não encontrado'
      );
    }

    try {
      const { id } = (await Order.create(newOrder, {
        include: [
          {
            model: OrderItem,
            as: 'items',
          },
        ],
      })) as IOrder;
      return {
        ...newOrder,
        id,
      };
    } catch (err) {
      throw new OrdersException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao criar nova ordem.'
      );
    }
  }

  static async update(id: number, data: IOrder) {
    const order = await this.find(id);

    // busca pelo cliente se não encontrar então dispara exception
    if (data.id_cliente) {
      CustomerRepository.find(data.id_cliente);
    }

    // verifica se todos os produtos incluidos estão cadastrados
    if (Array.isArray(data.items)) {
      const { count } = await Product.findAndCountAll({
        where: {
          id: data.items.map((i) => i.id_produto),
        },
      });

      if (count !== data.items.length) {
        throw new OrdersException(
          Response.BAD_REQUEST,
          'Produto incluido não encontrado'
        );
      }
    }

    try {
      await order.update(data);

      // atualiza items
      if (Array.isArray(data.items)) {
        await OrderItem.destroy({
          where: {
            id_pedido: id,
          },
        });
        await OrderItem.bulkCreate(
          data.items.map((i) => ({ ...i, id_pedido: id }))
        );
      }
      return {
        ...data,
        id,
      };
    } catch (err) {
      throw new OrdersException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao atualizar pedido.'
      );
    }
  }

  static async find(id: number) {
    let order;
    try {
      order = (await Order.findByPk(id, {
        attributes: ['id', 'data', 'observacao', 'forma_pagamento'],
        include: [
          {
            association: 'customer',
            attributes: ['id', 'nome', 'email', 'cpf', 'sexo'],
          },
          {
            association: 'items',
            attributes: ['quantidade'],
            include: [
              {
                association: 'product',
                attributes: ['id', 'nome', 'cor', 'valor', 'tamanho'],
              },
            ],
          },
        ],
      })) as IOrder;
    } catch (err) {
      throw new OrdersException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao buscar pedido.'
      );
    }

    if (!order) {
      throw new OrdersException(Response.NOT_FOUND, 'Pedido não encontrado.');
    }

    return order;
  }

  static async delete(id: number) {
    const order = await this.find(id);

    try {
      await order.destroy();
      return true;
    } catch (err) {
      throw new OrdersException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao excluir pedido'
      );
    }
  }
}
