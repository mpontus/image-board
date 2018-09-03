describe("Front page loads posts", () => {
  it("should load posts", () => {
    cy.server().route("GET", "/api/posts?page=1", "fixture:posts.json");

    cy.visit("/");

    cy.get('[data-cy="card"]').should("have.length", 5);
  });
});
