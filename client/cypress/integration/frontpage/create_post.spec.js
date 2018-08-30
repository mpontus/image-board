describe("Creating a post", () => {
  beforeEach(() => {
    cy.server()
      .route("GET", "/api/posts?page=1", "fixture:posts-page-1.json")
      // Don't load any additional pages
      .route({
        method: "GET",
        url: "/api/posts?page=2",
        response: {},
        delay: 9000,
      })
      .route("POST", "/api/posts", "fixture:post.json");
  });

  beforeEach(() => {
    cy.login();
    cy.visit("/");
  });

  it("should create new post", () => {
    cy.upload("input[type=file]", "sample.jpg", "image/jpeg");
    cy.get('[data-cy="card"]').should("have.length", 6);
    cy.upload("input[type=file]", "sample.jpg", "image/jpeg");
    cy.get('[data-cy="card"]').should("have.length", 7);
  });

  it("should abort post creation", () => {
    cy.route({ method: "POST", url: "/api/posts", response: {}, delay: 9000 });
    cy.upload("input[type=file]", "sample.jpg", "image/jpeg");
    cy.get('[aria-label="Cancel"]').click();
    cy.get('[data-cy="card"]').should("have.length", 5);
  });

  it("should show error when the post has failed to upload", () => {
    cy.route({ method: "POST", url: "/api/posts", response: {}, status: 500 });
    cy.upload("input[type=file]", "sample.jpg", "image/jpeg");

    cy.get('[data-cy="card"]').should("have.length", 5);
    cy.contains("Create post failed");
  });
});
