describe("Post creation", () => {
  beforeEach(() => {
    cy.server().route("/api/posts?page=1", "fixture:posts");

    cy.login();

    cy.visit("/");
  });

  it("should create new post", () => {
    cy.upload('input[type="file"]', "sample.jpg");

    cy.get('[data-cy="card"]').should("have.length", 6);
  });
});
