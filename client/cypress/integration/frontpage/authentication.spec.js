describe("Authentication", () => {
  it("should update header", () => {
    cy.visit("/");

    cy.login();

    cy.get("header").contains("Logout");
  });
});
