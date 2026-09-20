/// <reference types="cypress" />

// Stubbing Math.random to 0 makes the shuffle deterministic: the correct
// model always lands in the first answer slot.
const answerFirst = () => {
  cy.get('[data-testid="answer"]').first().should('not.be.disabled').click();
};

describe('Guess the Model', () => {
  it('wins a million in classic mode', () => {
    cy.visit('/classic', {
      onBeforeLoad: (win) => {
        cy.stub(win.Math, 'random').returns(0);
      },
    });
    for (let i = 0; i < 15; i += 1) {
      answerFirst();
    }
    cy.contains('You are a millionaire!', { timeout: 10000 }).should('be.visible');
    cy.contains('$1,000,000').should('be.visible');
  });

  it('banks a safe haven when an answer is wrong', () => {
    cy.visit('/classic', {
      onBeforeLoad: (win) => {
        cy.stub(win.Math, 'random').returns(0);
      },
    });
    for (let i = 0; i < 5; i += 1) {
      answerFirst();
    }
    // The sixth answer is deliberately wrong, so the $1,000 haven pays out.
    cy.get('[data-testid="answer"]').last().should('not.be.disabled').click();
    cy.contains('That is the wrong answer', { timeout: 10000 }).should('be.visible');
    cy.contains('$1,000').should('be.visible');
  });

  it('spends the fifty-fifty lifeline', () => {
    cy.visit('/classic', {
      onBeforeLoad: (win) => {
        cy.stub(win.Math, 'random').returns(0);
      },
    });
    cy.get('[data-testid="lifeline-fiftyFifty"]').click();
    cy.get('[data-testid="answer"]:disabled').should('have.length', 2);
    cy.get('[data-testid="lifeline-fiftyFifty"]').should('be.disabled');
  });

  it('walks away with the money already won', () => {
    cy.visit('/classic', {
      onBeforeLoad: (win) => {
        cy.stub(win.Math, 'random').returns(0);
      },
    });
    answerFirst();
    answerFirst();
    cy.contains('button', 'Walk away').should('not.be.disabled').click();
    cy.contains('You walked away').should('be.visible');
    cy.contains('$200').should('be.visible');
  });

  it('earns the eagle eye title in quiz mode', () => {
    cy.visit('/quiz', {
      onBeforeLoad: (win) => {
        cy.stub(win.Math, 'random').returns(0);
      },
    });
    for (let i = 0; i < 20; i += 1) {
      answerFirst();
    }
    cy.contains('eagle eye', { timeout: 10000 }).should('be.visible');
  });
});
