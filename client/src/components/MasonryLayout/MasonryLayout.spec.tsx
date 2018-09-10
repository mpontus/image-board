import * as React from "react";
import * as ReactDOM from "react-dom";
import MasonryLayout from "./MasonryLayout";

describe("MasonryLayout", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <MasonryLayout
        cellCount={5}
        maxCellWidth={100}
        cellRenderer={({ index }) => <div>{index}</div>}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
