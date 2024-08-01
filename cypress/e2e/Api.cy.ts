import { should } from "chai";
import { skip } from "node:test";
import { TestBook } from "../support/Page_Module/Test";
import 'cypress-xpath';


describe("Filtros da DF", () => {

  it("Colocando um objeto no carrinho", () => {
    cy.visit("https://loja.imaginarium.com.br/")
    cy.xpath(TestBook.BtnFecharPopUp).click();
    cy.wait(7000)
    cy.xpath(TestBook.BtnFecharModal).click()
    cy.xpath(TestBook.BtnFechar).click();
    cy.wait(7000)
    cy.xpath(TestBook.BtnAdicionarSacola).click();
    cy.xpath(TestBook.BtnFecharPedido).click();
    cy.xpath(TestBook.ValidarPedidoNoCarrinho).should('exist');
  });

  it("Returns the status of the API.", () => {
    cy.request('https://simple-books-api.glitch.me/status')
  });

  it("Returns a list of books.", () => {
    cy.request('https://simple-books-api.glitch.me/books/').as('books').then((response: Cypress.Response<any>) => {
      // Verifique o status da resposta
      expect(response.status).to.eq(200);
      console.log('Toda a resposta:', response);
      console.log('Todo o corpo:', response.body);
      console.log('Todo o cabeçalho:', response.headers);
    });
  });
  it("Get a single book", () => {
    cy.request('https://simple-books-api.glitch.me/books/1').as('books').then((response: Cypress.Response<any>) => {
      // Verifique o status da resposta
      expect(response.status).to.eq(200);
      console.log('Toda a resposta:', response);
      console.log('Todo o corpo:', response.body);
      console.log('Todo o cabeçalho:', response.headers);
    });
  });

  it("Enviando requisição e validando dados especificos da API", () => {
    //Acão 
    cy.request('https://simple-books-api.glitch.me/books/1').as('books').then((response: Cypress.Response<any>) => {
      // Verificação
      expect(response.status).to.eq(200);
      // Verifique os campos específicos na resposta
      expect(response.body.id).to.equal(1);
      expect(response.body.type).to.equal('fiction');
    });
  });

  it('Criação da requisição post para criação de um livro', () => {
    // Defina o endpoint e o token de autenticação
    const endpoint = 'https://simple-books-api.glitch.me/orders/';
    const authToken = 'Bearer <YOUR TOKEN>'; // Token da Aplicação 

    // O Corpo da solicitação
    const requestBody = {
      livroId: 1,
      nomedocliente: 'João'
    };

    // Ação
    cy.request({
      method: 'POST',
      url: endpoint,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: requestBody
    }).then((response) => {
      // Verifique o status da resposta
      expect(response.status).to.eq(201);


      expect(response.body).to.have.property('id');

      //Validação no terminal
      console.log('Full Response:', response);


      console.log('Order ID:', response.body.id);
    });
  });

  it('GET nas orders ', () => {
    // Defina o endpoint e o token de autenticação
    const endpoint = 'https://simple-books-api.glitch.me/orders';
    const authToken = 'SEU_TOKEN_AQUI'; // Token


    cy.request({
      method: 'GET',
      url: endpoint,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then((response) => {
      //Validação
      expect(response.status).to.eq(200);


      expect(response.body).to.be.an('array');


      console.log('Full Response:', response);


      console.log('Orders:', response.body);


      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it('should retrieve a specific order and check the response', () => {
    // Defina o endpoint e o token de autenticação
    const orderId = 1; // ID do pedido que iremos buscar
    const endpoint = `https://simple-books-api.glitch.me/pedidos/${orderId}`;
    const authToken = 'SEU_TOKEN_AQUI'; // Token de autenticação

    // Faça a solicitação GET para a API
    cy.request({
      method: 'GET',
      url: endpoint,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then((response) => {
      // Verifique o status da resposta
      expect(response.status).to.eq(200);

      // Verifique se a resposta contém o ID do pedido
      expect(response.body).to.have.property('id', orderId);

      // resposta completa no console
      console.log('Full Response:', response);

      // resposta no console
      console.log('Order Details:', response.body);
    });
  });
  it('Comando de update em uma ordem', () => {
    // ID do pedido 
    const orderId = 'ID TESE'; // Substitua pelo ID do pedido que você deseja atualizar
    const endpoint = `https://simple-books-api.glitch.me/orders/${orderId}`;
    const authToken = 'TOKEN';

    const updateBody = {
      nomedocliente: 'Lucas souza'
    };


    cy.request({
      method: 'PATCH',
      url: endpoint,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: updateBody
    }).then((response) => {
      //Status da resposta
      expect(response.status).to.eq(200);


      expect(response.body).to.have.property('nomedocliente', updateBody.nomedocliente);


      console.log('Full Response:', response);


      console.log('Updated Order:', response.body);
    });
  });
  it('Deletar uma order', () => {
    // Defina o ID do pedido a ser excluído e o endpoint
    const orderId = 'id pedido'; // Substitua pelo ID do pedido que você deseja excluir
    const endpoint = `https://simple-books-api.glitch.me/pedidos/${orderId}`;
    const authToken = 'token';

    // Faça a solicitação DELETE para a API
    cy.request({
      method: 'DELETE',
      url: endpoint,
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      failOnStatusCode: false // Continue mesmo se o status da resposta for um erro
    }).then((response) => {
      // Verifique o status da resposta
      expect(response.status).to.eq(204); // Status 204 No Content para uma exclusão bem-sucedida

      // Verifique se a exclusão foi realmente aplicada (obter o pedido excluído)
      cy.request({
        method: 'GET',
        url: endpoint,
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        failOnStatusCode: false
      }).then((getResponse) => {
        // Verifique se a resposta da solicitação GET retorna um erro (pedido não encontrado)
        expect(getResponse.status).to.eq(404); // Status 404 Not Found para um pedido que não existe mais


        console.log('Delete Response:', response);
        console.log('Post-Deletion GET Response:', getResponse);
      });
    });
  });
});


