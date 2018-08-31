describe("Front page loads posts", () => {
  it("should load posts", () => {
    cy.server().route("GET", "/api/posts", "fixtures:posts.json");

    cy.visit("/");

    cy.get('[data-cy="card"]').should("have.length", 5);
  });
});
