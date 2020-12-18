import request from 'supertest';
import app from '../../src/app';
import truncate from '../helpers/database';
import Customer from '../../src/app/models/Customer';

describe('CustomersController', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('lista clientes', async () => {
    const clientes = [
      {
        nome: 'Mauri',
        email: 'email@gmail.com',
        sexo: 'm',
        cpf: '99999999999',
      },
    ];

    await Customer.bulkCreate(clientes);

    const response = await request(app.server).get('/clientes').send();
    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual(clientes);
  });

  it('obter cliente', async () => {
    const cliente = {
      nome: 'Mauri',
      email: 'email@gmail.com',
      sexo: 'm',
      cpf: '99999999999',
    };
    await Customer.create(cliente);

    const response = await request(app.server).get('/clientes/1').send();
    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual({
      ...cliente,
      ...{ id: 1 },
    });
  });

  it('obter cliente não cadastrado', async () => {
    const response = await request(app.server).get('/clientes/1').send();
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Cliente não encontrado.');
  });

  it('criar cliente', async () => {
    const cliente = {
      nome: 'Mauri',
      email: 'email@gmail.com',
      sexo: 'm',
      cpf: '99999999999',
    };

    const response = await request(app.server).post('/clientes').send(cliente);
    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual({
      id: 1,
      ...cliente,
    });
  });

  it('validação campos criar cliente', async () => {
    let response = await request(app.server).post('/clientes').send({
      email: 'email@gmail.com',
      sexo: 'm',
      cpf: '99999999999',
    });
    expect(response.status).toBe(400);
    expect(response.body.data).toBe('nome is a required field');
    expect(response.body.message).toBe('Requisição inválida');

    response = await request(app.server).post('/clientes').send({
      nome: 'Mauri',
      sexo: 'm',
    });

    expect(response.status).toBe(400);
    expect(response.body.data).toBe('cpf is a required field');
    expect(response.body.message).toBe('Requisição inválida');
  });

  it('atualizar cliente', async () => {
    const customer = {
      nome: 'Mauri',
      email: 'email@gmail.com',
      sexo: 'm',
      cpf: '99999999999',
    };

    Customer.create(customer);

    const response = await request(app.server)
      .put('/clientes/1')
      .send({
        ...customer,
        ...{ nome: 'Mauri update' },
      });
    expect(response.status).toBe(200);
    expect(response.body.data).toStrictEqual({
      ...customer,
      ...{ id: 1, nome: 'Mauri update' },
    });
  });

  it('validacao atualizar cliente', async () => {
    const customer = {
      nome: 'Mauri',
      email: 'email@gmail.com',
      sexo: 'm',
      cpf: '99999999999',
    };

    Customer.create(customer);

    const response = await request(app.server)
      .put('/clientes/1')
      .send({ cpf: '555' });

    expect(response.status).toBe(400);
    expect(response.body.data).toBe('cpf must be at least 11 characters');
    expect(response.body.message).toBe('Requisição inválida');
  });

  it('deletar cliente', async () => {
    const cliente = {
      nome: 'Mauri',
      email: 'email@gmail.com',
      sexo: 'm',
      cpf: '99999999999',
    };

    Customer.create(cliente);

    const response = await request(app.server).delete('/clientes/1').send();

    expect(response.status).toBe(200);
    expect(response.body.data).toBe(true);
  });

  it('deletar cliente não cadastrado', async () => {
    const response = await request(app.server).delete('/clientes/1').send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Cliente não encontrado.');
  });
});
