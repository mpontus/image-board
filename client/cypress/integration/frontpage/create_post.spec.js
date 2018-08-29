describe("Post creation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  context("As authenticated user", () => {
    before(() => {
      cy.login();
    });

    it("starts the upload", () => {
      cy.upload("input[type=file]", "sample.jpg", "image/jpeg");
    });
  });
});
