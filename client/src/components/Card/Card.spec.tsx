import faker from "faker";
import * as React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";
import Card from "./Card";

faker.seed(123);

/**
 * Extract the type of component props
 */
declare type ComponentProps<T> = T extends React.ComponentType<infer R>
  ? R
  : any;

const defaultProps: ComponentProps<typeof Card> = {
  imageUrl: faker.image.imageUrl(),
  height: faker.random.number(),
  width: faker.random.number()
};

afterEach(cleanup);

describe("Card", () => {
  it("should show author avatar", () => {
    const authorAvatarUrl = faker.image.imageUrl();
    const { getByLabelText } = render(
      <Card {...defaultProps} authorAvatarUrl={authorAvatarUrl} />
    );

    const avatar = getByLabelText("Avatar");
    expect(avatar).toEqual(expect.any(HTMLImageElement));
    expect((avatar as HTMLImageElement).src).toBe(authorAvatarUrl);
  });

  it("should display author name", () => {
    const authorName = faker.internet.userName();
    const { getByText } = render(
      <Card {...defaultProps} authorName={authorName} />
    );

    getByText(authorName);
  });

  it("should show delete button when the user is the owner", () => {
    const { getByLabelText } = render(
      <Card {...defaultProps} canDelete={true} />
    );

    getByLabelText("Delete");
  });

  it("should dispatch onDeleteClick when delete button is pressed", () => {
    const onDeleteClick = jest.fn();
    const { getByLabelText } = render(
      <Card {...defaultProps} canDelete={true} onDeleteClick={onDeleteClick} />
    );

    fireEvent(
      getByLabelText("Delete"),
      new Event("click", {
        bubbles: true
      })
    );

    expect(onDeleteClick).toHaveBeenCalled();
  });

  it.skip("should display the like counter", () => {
    const likeCount = 100000007;
    const { getByText } = render(
      <Card {...defaultProps} likeCount={likeCount} />
    );

    getByText(`${likeCount}`);
  });

  it.skip("should color the like button pink when the post is liked", () => {
    render(<Card {...defaultProps} canLike={true} />);

    // TODO: Very little idea how to test this using RTL before implementation.
  });

  it("should enable like button if the user can not like the post", () => {
    const onLikeToggle = jest.fn();
    const { getByLabelText } = render(
      <Card {...defaultProps} canLike={true} onLikeToggle={onLikeToggle} />
    );

    const button = getByLabelText("Like");
    expect(button).toEqual(expect.any(HTMLButtonElement));
    expect((button as HTMLButtonElement).disabled).toBe(false);
  });

  it("should disable like button if the user can not like the post", () => {
    const onLikeToggle = jest.fn();
    const { getByLabelText } = render(
      <Card {...defaultProps} canLike={false} onLikeToggle={onLikeToggle} />
    );

    const button = getByLabelText("Like");
    expect(button).toEqual(expect.any(HTMLButtonElement));
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it("should dispatch onLikeToggle when the like button is pressed", () => {
    const onLikeToggle = jest.fn();
    const { getByLabelText } = render(
      <Card {...defaultProps} canLike={true} onLikeToggle={onLikeToggle} />
    );

    fireEvent(
      getByLabelText("Like"),
      new Event("click", {
        bubbles: true
      })
    );

    expect(onLikeToggle).toHaveBeenCalled();
  });
});
