import * as React from "react";
import {
  render,
  cleanup,
  fireEvent,
  RenderResult,
} from "react-testing-library";
import Header from "./Header";

afterEach(() => {
  cleanup();
});

describe("when user is unauthenticated", () => {
  let result: RenderResult;

  beforeEach(() => {
    result = render(<Header isAuthenticated={false} />);
  });

  it("should render login button", () => {
    result.getByText("Login");
  });

  it("should not render logout button", () => {
    expect(result.queryByText("Logout")).toBeNull();
  });
});

describe("when user is authenticated", () => {
  let result: RenderResult;

  beforeEach(() => {
    result = render(<Header isAuthenticated={true} />);
  });

  it("should render upload component", () => {
    result.getByText("Upload Picture");
  });

  it("should render logout button", () => {
    result.getByText("Logout");
  });

  it("should not render login button", () => {
    expect(result.queryByText("Login")).toBeNull();
  });
});

describe("when login button is pressed", () => {
  let result: RenderResult;
  let onLoginClick: jest.Mock;

  beforeEach(() => {
    onLoginClick = jest.fn();

    result = render(
      <Header isAuthenticated={false} onLoginClick={onLoginClick} />
    );

    fireEvent(
      result.getByText("Login"),
      new MouseEvent("click", {
        bubbles: true,
      })
    );
  });

  it("should dispatch onLoginClick event", () => {
    expect(onLoginClick).toHaveBeenCalled();
  });
});

describe("when logout button is pressed", () => {
  let result: RenderResult;
  let onLogoutClick: jest.Mock;

  beforeEach(() => {
    onLogoutClick = jest.fn();

    result = render(
      <Header isAuthenticated={true} onLogoutClick={onLogoutClick} />
    );

    fireEvent(
      result.getByText("Logout"),
      new MouseEvent("click", {
        bubbles: true,
      })
    );
  });

  it("should dispatch onLogoutClick event", () => {
    expect(onLogoutClick).toHaveBeenCalled();
  });
});

describe("when file is selected", () => {
  const file = new File([""], "picture.png", { type: "image/png " });
  let onFileChange: jest.Mock;

  beforeEach(() => {
    onFileChange = jest.fn(e => {
      expect(e.target.files).toEqual([file]);
    });

    const { getByTestId } = render(
      <Header isAuthenticated={true} onFileChange={onFileChange} />
    );
    const input = getByTestId("upload");

    Object.defineProperty(input, "files", { value: [file] });

    fireEvent.change(input, { bubbles: true });
  });

  it("should dispatch onFileChange event", () => {
    expect(onFileChange).toHaveBeenCalled();
  });
});
