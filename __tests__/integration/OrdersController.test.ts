import request from 'supertest';
import app from '../../src/app';
import truncate from '../helpers/database';
import Customer, { ICustomer } from '../../src/app/models/Customer';
import Product, { IProduct } from '../../src/app/models/Product';
import Order, { IOrder } from '../../src/app/models/Order';
import OrderItem from '../../src/app/models/OrderItem';

const customerData = {
  nome: 'Cliente',
  email: 'email@gmail.com',
  cpf: '99999999999',
  sexo: 'm',
};

describe('OrdersController', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('lista de pedidos', async () => {
    const customer = (await Customer.create({ ...customerData })) as ICustomer;
    const product1 = (await Product.create({
      nome: 'Produto 1',
      cor: 'vermelho',
      tamanho: 'gg',
      valor: 12.0,
    })) as IProduct;

    const product2 = (await Product.create({
      nome: 'Produto 2',
      cor: 'azul',
      tamanho: 'm',
      valor: 20.0,
    })) as IProduct;

    const product3 = (await Product.create({
      nome: 'Produto 3',
      cor: 'preto',
      tamanho: 'g',
      valor: 25,
    })) as IProduct;

    const order = (await Order.create(
      {
        id_cliente: customer.id,
        data: '2020-01-01 13:31:59',
        observacao: 'Observação',
        forma_pagamento: 1,
        items: [
          {
            id_produto: product1.id,
            quantidade: 1,
          },
          {
            id_produto: product2.id,
            quantidade: 2,
          },
          {
            id_produto: product3.id,
            quantidade: 4,
          },
        ],
      },
      {
        include: [
          {
            model: OrderItem,
            as: 'items',
          },
        ],
      }
    )) as IOrder;

    const response = await request(app.server).get('/pedidos').send();
    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual([
      {
        id: order.id,
        data: `2020-01-01T13:31:59.000Z`,
        observacao: order.observacao,
        forma_pagamento: order.forma_pagamento,
        customer: {
          id: customer.id,
          nome: customer.nome,
          email: customer.email,
          sexo: customer.sexo,
          cpf: customer.cpf,
        },
        items: [
          {
            quantidade: order.items[0].quantidade,
            product: {
              id: product1.id,
              nome: product1.nome,
              cor: product1.cor,
              valor: product1.valor,
              tamanho: product1.tamanho,
            },
          },
          {
            quantidade: order.items[1].quantidade,
            product: {
              id: product2.id,
              nome: product2.nome,
              cor: product2.cor,
              valor: product2.valor,
              tamanho: product2.tamanho,
            },
          },
          {
            quantidade: order.items[2].quantidade,
            product: {
              id: product3.id,
              nome: product3.nome,
              cor: product3.cor,
              valor: product3.valor,
              tamanho: product3.tamanho,
            },
          },
        ],
      },
    ]);
  });

  it('buscar pedido', async () => {
    const customer = (await Customer.create({
      ...customerData,
    })) as ICustomer;
    const product1 = (await Product.create({
      nome: 'Produto 1',
      cor: 'vermelho',
      tamanho: 'gg',
      valor: 12.0,
    })) as IProduct;

    const product2 = (await Product.create({
      nome: 'Produto 2',
      cor: 'azul',
      tamanho: 'm',
      valor: 20.0,
    })) as IProduct;

    const product3 = (await Product.create({
      nome: 'Produto 3',
      cor: 'preto',
      tamanho: 'g',
      valor: 25,
    })) as IProduct;

    const order = (await Order.create(
      {
        id_cliente: customer.id,
        data: '2020-01-01 13:31:59',
        observacao: 'Observação',
        forma_pagamento: 1,
        items: [
          {
            id_produto: product1.id,
            quantidade: 1,
          },
          {
            id_produto: product2.id,
            quantidade: 2,
          },
          {
            id_produto: product3.id,
            quantidade: 4,
          },
        ],
      },
      {
        include: [
          {
            model: OrderItem,
            as: 'items',
          },
        ],
      }
    )) as IOrder;

    const response = await request(app.server).get('/pedidos/1').send();
    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual({
      id: order.id,
      data: `2020-01-01T13:31:59.000Z`,
      observacao: order.observacao,
      forma_pagamento: order.forma_pagamento,
      customer: {
        id: customer.id,
        nome: customer.nome,
        email: customer.email,
        sexo: customer.sexo,
        cpf: customer.cpf,
      },
      items: [
        {
          quantidade: order.items[0].quantidade,
          product: {
            id: product1.id,
            nome: product1.nome,
            cor: product1.cor,
            valor: product1.valor,
            tamanho: product1.tamanho,
          },
        },
        {
          quantidade: order.items[1].quantidade,
          product: {
            id: product2.id,
            nome: product2.nome,
            cor: product2.cor,
            valor: product2.valor,
            tamanho: product2.tamanho,
          },
        },
        {
          quantidade: order.items[2].quantidade,
          product: {
            id: product3.id,
            nome: product3.nome,
            cor: product3.cor,
            valor: product3.valor,
            tamanho: product3.tamanho,
          },
        },
      ],
    });
  });

  it('criar pedido', async () => {
    const customer = (await Customer.create({ ...customerData })) as ICustomer;

    const product1 = (await Product.create({
      nome: 'Produto 1',
      cor: 'vermelho',
      tamanho: 'gg',
      valor: 12.0,
    })) as IProduct;

    const product2 = (await Product.create({
      nome: 'Produto 2',
      cor: 'azul',
      tamanho: 'm',
      valor: 20.0,
    })) as IProduct;

    const product3 = (await Product.create({
      nome: 'Produto 3',
      cor: 'preto',
      tamanho: 'g',
      valor: 25,
    })) as IProduct;

    const order = {
      id_cliente: customer.id,
      data: '2020-01-01 13:31:59',
      observacao: 'Observação',
      forma_pagamento: 1,
      items: [
        {
          id_produto: product1.id,
          quantidade: 1,
        },
        {
          id_produto: product2.id,
          quantidade: 2,
        },
        {
          id_produto: product3.id,
          quantidade: 4,
        },
      ],
    };

    const response = await request(app.server).post('/pedidos').send(order);

    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual({
      id: 1,
      id_cliente: customer.id,
      data: `2020-01-01 13:31:59`,
      observacao: 'Observação',
      forma_pagamento: 1,
      items: [
        {
          quantidade: order.items[0].quantidade,
          id_produto: product1.id,
        },
        {
          quantidade: order.items[1].quantidade,
          id_produto: product2.id,
        },
        {
          quantidade: order.items[2].quantidade,
          id_produto: product3.id,
        },
      ],
    });
  });

  it('atualizar pedido', async () => {
    const customer = (await Customer.create({
      ...customerData,
    })) as ICustomer;
    const product1 = (await Product.create({
      nome: 'Produto 1',
      cor: 'vermelho',
      tamanho: 'gg',
      valor: 12.0,
    })) as IProduct;

    await Order.create(
      {
        id_cliente: customer.id,
        data: '2020-01-01 13:31:59',
        observacao: 'Observação',
        forma_pagamento: 1,
        items: [
          {
            id_produto: product1.id,
            quantidade: 1,
          },
        ],
      },
      {
        include: [
          {
            model: OrderItem,
            as: 'items',
          },
        ],
      }
    );

    const response = await request(app.server).put('/pedidos/1').send({
      forma_pagamento: 2,
      observacao: 'update observação',
    });
    expect(response.status).toBe(200);
    expect(response.body.data.forma_pagamento).toBe(2);
    expect(response.body.data.observacao).toBe('update observação');
  });

  it('deletar pedido', async () => {
    const customer = (await Customer.create({
      ...customerData,
    })) as ICustomer;
    const product1 = (await Product.create({
      nome: 'Produto 1',
      cor: 'vermelho',
      tamanho: 'gg',
      valor: 12.0,
    })) as IProduct;

    await Order.create(
      {
        id_cliente: customer.id,
        data: '2020-01-01 13:31:59',
        observacao: 'Observação',
        forma_pagamento: 1,
        items: [
          {
            id_produto: product1.id,
            quantidade: 1,
          },
        ],
      },
      {
        include: [
          {
            model: OrderItem,
            as: 'items',
          },
        ],
      }
    );

    const response = await request(app.server).delete('/pedidos/1').send();
    expect(response.status).toBe(200);
    expect(response.body.data).toBe(true);
  });
});
