// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//MailSlurp client configuration
const { MailSlurp } = require('mailslurp-client');

const apiKey = Cypress.env('MAILSLURP_API_KEY');
const mailslurp = new MailSlurp({apiKey});

Cypress.Commands.add("waitEmail", (inboxId) => {
    // wait 42s max for email
    return mailslurp.waitForLatestEmail(inboxId, 42000)
});

Cypress.Commands.add("createMailbox", () => {
    return mailslurp.createInbox();
});
