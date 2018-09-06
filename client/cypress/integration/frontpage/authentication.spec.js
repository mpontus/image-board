describe("Authentication", () => {
  context("when the user is unauthenticated", () => {
    it("should display login button in the header", () => {
      cy.visit("/");

      cy.get("header").contains("Login");
    });
  });

  context("when the user is authenticated", () => {
    it("should display logout button in the header", () => {
      cy.login();

      cy.visit("/");

      cy.get("header").contains("Logout");
    });
  });
});
