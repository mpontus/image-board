describe("Creating a post", () => {
  beforeEach(() => {
    cy.server()
      .route("GET", "/api/posts?page=1", "fixture:posts.json")
      .route("POST", "/api/posts", "fixture:post.json");
  });

  beforeEach(() => {
    cy.login();
    cy.visit("/");
  });

  it("should create new post", () => {
    cy.get('[data-cy="card"]').then(cards => {
      cy.upload("input[type=file]", "sample.jpg", "image/jpeg");

      cy.get('[data-cy="card"]').should("have.length", cards.length + 1);
    });
  });

  it("should abort post creation", () => {
    cy.route({
      method: "POST",
      url: "/api/posts",
      delay: 9000,
      response: {},
    });

    cy.get('[data-cy="card"]').then(cards => {
      cy.upload("input[type=file]", "sample.jpg", "image/jpeg");

      cy.get('[aria-label="Cancel"]').click();

      cy.get('[data-cy="card"]').should("have.length", cards.length);
    });
  });
});
