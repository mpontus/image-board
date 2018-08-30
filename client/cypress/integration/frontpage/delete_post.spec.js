describe("Deleteing a post", () => {
  beforeEach(() => {
    cy.login();
    cy.server()
      .route("GET", "/api/posts?page=1", "fixture:posts-page-1.json")
      // Don't load any additional pages
      .route({
        method: "GET",
        url: "/api/posts?page=2",
        response: {},
        delay: 9000,
      })
      .route("DELETE", "/api/posts/*", {});
  });

  it("should remove a post", () => {
    cy.visit("/")
      .get('[data-cy="card"] [aria-label="Delete"]')
      .click();

    cy.get('[data-cy="card"]').should("have.length", 4);
  });

  it.skip("should handle delete errors", () => {
    cy.route({
      method: "DELETE",
      url: "/api/posts/*",
      response: {},
      status: 500,
    });

    cy.visit("/")
      .get('[data-cy="card"] [aria-label="Delete"]')
      .click();

    cy.contains("Failed to delete a post");

    cy.get('[data-cy="card"]').should("have.length", 5);
  });
});
