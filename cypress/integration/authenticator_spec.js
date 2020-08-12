describe('Authenticator:', function() {
    beforeEach(function() {
        cy.visit('/');
    });

    describe('Sign In:', () => {
        it('can click signin', () => {
            cy.get(selectors.usernameInput).type("DUMMY_USERNAME");
            cy.get(selectors.signInPasswordInput).type("DUMMY_PASSWORD");
            cy.get(selectors.signInSignInButton).contains('Sign In').click();
        });
    });

    describe('Create Account:', () => {
        it('can go to account creation page', () => {
            cy.get(selectors.createAccountLink).contains('登録').click();

            cy.get(selectors.signUpEmail).type("DUMMY_USERNAME");
            cy.get(selectors.signUpPassword).type("DUMMY_PASSWORD");
            cy.get(selectors.createAccountButton).contains('Create Account').click();
        });
    });

    const { username, password } = { username: "USERNAME", password: "PASSWORD" }

    describe('Kanban:', () => {
        it('can go to kanban page', () => {
            cy.get(selectors.usernameInput).type(username);
            cy.get(selectors.signInPasswordInput).type(password);
            cy.get(selectors.signInSignInButton).contains('Sign In').click();
        });

        it('can show login user', () => {
            cy.get(selectors.usernameInput).type(username);
            cy.get(selectors.signInPasswordInput).type(password);
            cy.get(selectors.signInSignInButton).contains('Sign In').click();

            const user = username.slice(0, 4);
            cy.get(selectors.noteBlock).contains('Hello');
            cy.get(selectors.noteBlock).contains(user);
        });

        it('can add new Task', () => {
            cy.get(selectors.usernameInput).type(username);
            cy.get(selectors.signInPasswordInput).type(password);
            cy.get(selectors.signInSignInButton).contains('Sign In').click();

            cy.get(selectors.taskForm).type("New Task" + Math.random().toString(32).substring(2));
            cy.get(selectors.submitTask).contains('Put It! 🤏').click();
        });
    });
});
export const selectors = {
    usernameInput: '[data-test="username-input"]',
    signInPasswordInput: '[data-test="sign-in-password-input"]',
    signInSignInButton: '[data-test="sign-in-sign-in-button"]',

    createAccountLink: '[data-test="sign-in-create-account-link"]',

    signUpEmail: '[signupfield="username"]',
    signUpPassword: '[signupfield="password"]',
    createAccountButton: '[data-test="sign-up-create-account-button"]',

    noteBlock: '.privateNote',
    taskForm: '#chat-form',
    submitTask: '.submit'
}