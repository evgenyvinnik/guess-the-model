/// <reference types="cypress" />

describe('Guess the Model', () => {
  it('wins a million in classic mode', () => {
    cy.visit('/classic', {
      onBeforeLoad: (win) => {
        cy.stub(win.Math, 'random').returns(0);
      },
    });
    for (let i = 0; i < 15; i += 1) {
      cy.get('div.grid button').first().click();
    }
    cy.contains('Congratulations! You won a million!').should('be.visible');
  });

  it('earns the eagle eye title in quiz mode', () => {
    cy.visit('/quiz', {
      onBeforeLoad: (win) => {
        cy.stub(win.Math, 'random').returns(0);
      },
    });
    for (let i = 0; i < 20; i += 1) {
      cy.get('div.grid button').first().click();
    }
    cy.contains('Rank: eagle eye').should('be.visible');
  });
});
