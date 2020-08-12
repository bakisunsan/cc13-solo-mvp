describe('About:', function() {
    beforeEach(function() {
        cy.visit('/');
    });

    describe('About:', () => {
        it('can go to about page', () => {
            cy.get(selectors.aboutLink).click();

            cy.get(selectors.logo).should('be.visible');
            cy.get(selectors.usage).should('be.visible');
        });
    });
});
export const selectors = {
    aboutLink: '[href="/about"]',
    logo: '#logo',
    usage: '#usage'
}