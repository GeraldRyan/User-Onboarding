describe("Testing our form", function(){
  beforeEach(function(){
    cy.visit("http://localhost:3000")
  })
  it("Add test to inputs and submit form", function(){
    cy.get('[for="name"] > input')
    .type("Jessica Rabbit")
    .should("have.value", "Jessica Rabbit")
    cy.get('[for="email"] > input')
    .type("Jessica@Rabbits.com")
    .should("have.value", "Jessica@Rabbits.com")
    cy.get('[for="Password"] > input')
    .type("1234")
    .should("have.value","1234")
    cy.get('[for="agreement"] > input')
    .check()
    cy.get('button')
    .click()
    
  })
})
