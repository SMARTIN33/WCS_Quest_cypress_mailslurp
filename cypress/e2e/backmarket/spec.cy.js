describe("Password reset scenarios", () => {
  const baseUrl = "https://preprod.backmarket.fr/fr-fr";

  // create Mailslurp email
  before(() => {
    cy.mailslurp({
      apiKey: Cypress.env("MAILSLURP_API_KEY"),
    })
      .then((mailslurp) => mailslurp.createInbox())
      .then((inbox) => {
        cy.wrap(inbox.id).as("inboxId");
        cy.wrap(inbox.emailAddress).as("email");
      });
  });

  it("Create account", function () {
    // Visit the homepage
    cy.visit(baseUrl);

    // Cookie banner (accept all)
    cy.get('[data-qa="accept-cta"]').click();

    // Access to login page of the site
    cy.get('[data-test="icon-avatar"]').click();
    cy.url("https://accounts.preprod.backmarket.fr/fr-fr/email").should(
      "contains",
      "/email"
    );

    // Register email address
    cy.get('[name="email"]').type(this.email);
    cy.get("#submit-login").should("have.text", "C'est moi").click();

    // Fill out signup form
    cy.url("https://accounts.preprod.backmarket.fr/fr-fr/email/signup").should(
      "contains",
      "/email/signup"
    );
    cy.get('[type="password"]').type("Flipper17@");
    cy.get('[name="first_name"]').type("Adèle");
    cy.get('[name="last_name"]').type("Moreau");
    cy.get("#submit-signup").click();
    cy.wait(1000);
    cy.url().should("eq", "https://preprod.backmarket.fr/fr-fr");
  });

  it("Reset user password", function () {
    // get login variables
    const email = this.email;
    const inboxId = this.inboxId;
    // Visit homepage
    cy.visit("https://preprod.backmarket.fr/fr-fr");
    // accept Cookies
    cy.get('[data-qa="accept-cta"]').click();
    cy.wait(3000);
    // Access to reset password page
    cy.get('[data-test="icon-avatar"]').click();
    cy.url("https://accounts.preprod.backmarket.fr/fr-fr/email", {
      timeout: 4500,
    }).should("contains", "/email");
    // Enter credentials
    cy.get("#email").type(this.email);
    cy.get("#submit-login").should("have.text", "C'est moi").click();
    cy.get("a").eq(2).click();
    cy.url("https://preprod.backmarket.fr/fr-fr/password-reset").should(
      "contain",
      "password-reset"
    );
    cy.get('[type="email"]').should("have.value", email);
    cy.get('[data-qa="password-reset-submit-button"]').click();
    cy.wait(6500);
    // Fetch info from mailSlurp
    cy.mailslurp({
      apiKey: Cypress.env("MAILSLURP_API_KEY"),
    })
      .then((mailslurp) => {
          return mailslurp.waitForLatestEmail(inboxId, 150000, true);
      })
      .then((response) => {
        const match = response.body.match(/<a\s+href="([^"]+)"/gm);
        const url = match[1].replace('<a href="', "").replace('"', "");
        //Navigate to the url and change password
        cy.visit(url);
        cy.get('[type="password"]').eq("0").type("Flipper17@2");
        cy.get('[type="password"]').eq("1").type("Flipper17@2");
        cy.get('[type="submit"]').eq("1").click();
      });
  });
});
