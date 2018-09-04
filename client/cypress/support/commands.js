const auth0 = require("auth0-js");

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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const login = () =>
  new Promise((resolve, reject) => {
    const webAuth = new auth0.WebAuth({
      domain: Cypress.env("REACT_APP_AUTH0_DOMAIN"),
      clientID: Cypress.env("REACT_APP_AUTH0_CLIENT_ID"),
      responseType: "token id_token"
    });

    webAuth.client.login(
      {
        realm: "Username-Password-Authentication",
        username: Cypress.env("CYPRESS_AUTH0_USERNAME"),
        password: Cypress.env("CYPRESS_AUTH0_PASSWORD"),
        audience: Cypress.env("CYPRESS_AUTH0_AUDIENCE"),
        scope: "openid email profile"
      },
      (err, result) => {
        err ? reject(err) : resolve(result);
      }
    );
  });

Cypress.Commands.add("login", () =>
  cy.window().then(async window => {
    const { idToken } = await login();

    window.localStorage.setItem("idToken", idToken);
  })
);

Cypress.Commands.add("upload", (selector, fileName, type) => {
  cy.get(selector).then(([el]) => {
    cy
      .fixture(fileName)
      .then(base64String =>
        Cypress.Blob.base64StringToBlob(base64String, "image/jpeg")
      )
      .then(blob =>
        // window.File in cypress context may be different from
        // application execution context, which will make instanceof
        // check to fail and firebase will panic
        cy.window().then(
          window =>
            new window.File([blob], fileName, {
              type
            })
        )
      )
      .then(file => {
        // Create FileList using DataTransfer
        const dt = new DataTransfer();

        dt.items.add(file);

        el.files = dt.files; // eslint-disable-line no-param-reassign
      });
  });
});
