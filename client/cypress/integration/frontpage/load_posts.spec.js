describe("Posts loading", () => {
  beforeEach(() => {
    cy.server();
  });

  it("should load frontpage posts", () => {
    cy.route("GET", "/api/posts?page=1", "fixture:posts-page-1.json");
    cy.visit("/");
    cy.get('[data-cy="card"]').should("have.length", 5);
  });

  it("should load additional posts", () => {
    cy.route("GET", "/api/posts?page=1", "fixture:posts-page-1.json");
    cy.route("GET", "/api/posts?page=2", "fixture:posts-page-2.json");
    cy.visit("/");
    cy.scrollTo(0, "100%");
    cy.get('[data-cy="card"]').should("have.length", 10);
  });

  it.skip("should show an error when posts failed to load", () => {
    cy.route({
      method: "GET",
      url: "/api/posts?page=1",
      response: {},
      status: 500,
    });
    cy.visit("/");
    cy.contains("An error occured. Please reload the page.");
  });
});
