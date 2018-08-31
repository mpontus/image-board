describe("Liking a post", () => {
  beforeEach(() => {
    cy.login();

    cy.server()
      .route("GET", "/api/posts?page=1", "fixture:posts-page-1.json")
      .route("PUT", "/api/posts/*/like", {})
      .route("DELETE", "/api/posts/*/like", {});
  });

  it("should like a post", () => {
    cy.visit("/");

    cy.get('[aria-label="Like"]:first').click();

    cy.get('[data-cy="likes-count"]:first').contains(2);
  });

  it("shold unlike the post", () => {
    cy.visit("/");

    cy.get('[aria-label="Like"]:first').click();
    cy.get('[aria-label="Like"]:first').click();

    cy.get('[data-cy="likes-count"]:first').contains(1);
  });

  it("should handle like error", () => {
    cy.visit("/");

    cy.route({
      method: "PUT",
      url: "/api/posts/*/like",
      status: 500,
      response: {},
    });

    cy.get('[aria-label="Like"]:first').click();

    cy.get('[data-cy="likes-count"]:first').contains(1);
    cy.contains("Failed to like the post");
  });
});
