# E-commerce feito em nodejs
Sistema de loja virtual utilizando nodejs junto com typescript, aplicação criada utilizando o framework web Express.js para controle de rotas, ORM Sequelize para gerenciamento e controle de tabelas incluindo models e migrations e nos tests utilizado o jest

## Principais tecnologias utilizadas
* Node: v.12;
* npm: v.6.14;
* typescript;
* sequelize;
* expressjs;
* jest;
* yarn;


## Requisitos
Toda a aplicação foi construida utilizando a verão 12 do node mas provavelmente funciona nas versões anteriores também.

node: v12
npm: v6.14

## Instalação

copiar o **.env.example** para **.env** e preencher os envs e em seguida executar os seguintes comandos:
```sh
  npm install # instala dependências
  npm install sequelize-cli -g # instala sequelize para executar migrations
  sequelize-cli db:migrate # executa migrations
  rodar servidor # iniciar servidor
```
documentação do sequelize cli caso necessário: [documentação](https://sequelize.org/master/manual/migrations.html);

## Tests
para executar os testes não é necessário rodar as migrations apenas instalar as dependências e executar o script de test:
```sh
  npm run test
```
