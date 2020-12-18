import Customer, { ICustomer } from '../../models/Customer';
import CustomersException from './CustomersException';
import Response from '../../Response';

export default class CustomersRepository {
  static async findAll() {
    try {
      const customers = await Customer.findAll({
        attributes: ['nome', 'cpf', 'sexo', 'email'],
      });
      return customers;
    } catch (err) {
      throw new CustomersException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao encontrar clientes.'
      );
    }
  }

  static async create(newCustomer: ICustomer) {
    try {
      const { id } = (await Customer.create(newCustomer)) as ICustomer;
      return {
        ...newCustomer,
        id,
      };
    } catch (err) {
      throw new CustomersException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao criar cliente.'
      );
    }
  }

  static async update(id: number, data: ICustomer) {
    const customer = await this.find(id);
    try {
      await customer.update(data);
      return {
        ...data,
        id,
      };
    } catch (err) {
      throw new CustomersException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao atualizar cliente.'
      );
    }
  }

  static async find(id: number) {
    let customer;
    try {
      customer = (await Customer.findByPk(id, {
        attributes: ['id', 'nome', 'cpf', 'sexo', 'email'],
      })) as ICustomer;
    } catch (err) {
      throw new CustomersException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao buscar produto.'
      );
    }

    if (!customer) {
      throw new CustomersException(
        Response.NOT_FOUND,
        'Cliente não encontrado.'
      );
    }

    return customer;
  }

  static async delete(id: number) {
    const customer = await this.find(id);

    try {
      await customer.destroy();
      return true;
    } catch (err) {
      throw new CustomersException(
        Response.INTERNAL_SERVER_ERROR,
        'Falha ao excluir cliente'
      );
    }
  }
}
