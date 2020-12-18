import request from 'supertest';
import app from '../../src/app';
import truncate from '../helpers/database';
import Product from '../../src/app/models/Product';

describe('ProductsController', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('lista produtos', async () => {
    const produto = {
      nome: 'Camisa 1',
      valor: 12.99,
      cor: 'vermelho',
      tamanho: 'GG',
    };
    await Product.bulkCreate([produto]);

    const response = await request(app.server).get('/produtos').send();
    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual([
      {
        ...produto,
        id: 1,
      },
    ]);
  });

  it('obter produto', async () => {
    const produto = {
      nome: 'Camisa 1',
      valor: 12.99,
      cor: 'vermelho',
      tamanho: 'GG',
    };
    await Product.create(produto);

    const response = await request(app.server).get('/produtos/1').send();
    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual({
      ...produto,
      ...{ id: 1 },
    });
  });

  it('obter produto não cadastrado', async () => {
    const response = await request(app.server).get('/produtos/1').send();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Produto não encontrado.');
  });

  it('criar produto', async () => {
    const produto = {
      nome: 'Camisa 1',
      valor: 12.99,
      cor: 'vermelho',
      tamanho: 'GG',
    };

    const response = await request(app.server).post('/produtos').send(produto);
    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual({
      id: 1,
      ...produto,
    });
  });

  it('validação campos criar produto', async () => {
    let response = await request(app.server).post('/produtos').send({
      valor: 12.99,
      cor: 'vermelho',
      tamanho: 'GG',
    });
    expect(response.status).toBe(400);
    expect(response.body.data).toBe('nome is a required field');
    expect(response.body.message).toBe('Requisição inválida');

    response = await request(app.server).post('/produtos').send({
      nome: 'Produto 1',
      cor: 'vermelho',
      tamanho: 'GG',
    });

    expect(response.status).toBe(400);
    expect(response.body.data).toBe('valor is a required field');
    expect(response.body.message).toBe('Requisição inválida');
  });

  it('atualizar produto', async () => {
    const produto = {
      nome: 'Camisa 1',
      valor: 12.99,
      cor: 'vermelho',
      tamanho: 'GG',
    };

    Product.create(produto);

    const response = await request(app.server)
      .put('/produtos/1')
      .send({
        ...produto,
        ...{ nome: 'Camisa update' },
      });
    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual({
      ...produto,
      ...{ id: 1, nome: 'Camisa update' },
    });
  });

  it('validacao atualizar produto', async () => {
    const produto = {
      nome: 'Camisa 1',
      valor: 12.99,
      cor: 'vermelho',
      tamanho: 'GG',
    };

    Product.create(produto);

    const response = await request(app.server)
      .put('/produtos/1')
      .send({ nome: [] });

    expect(response.status).toBe(400);
    expect(response.body.data).toBe(
      'nome must be a `string` type, but the final value was: `[]`.'
    );
    expect(response.body.message).toBe('Requisição inválida');
  });

  it('deletar produto', async () => {
    const produto = {
      nome: 'Camisa 1',
      valor: 12.99,
      cor: 'vermelho',
      tamanho: 'GG',
    };

    Product.create(produto);

    const response = await request(app.server).delete('/produtos/1').send();

    expect(response.status).toBe(200);
    expect(response.body.data).toBe(true);
  });

  it('deletar produto não cadastrado', async () => {
    const response = await request(app.server).delete('/produtos/1').send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Produto não encontrado.');
  });
});
