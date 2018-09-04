import * as React from "react";
import { PostListContainer, PostContainer } from "./containers";
import { MasonryLayout, Card } from "./components";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <PostListContainer>
          {({ ids }) => (
            <MasonryLayout
              gutter={10}
              maxCellWidth={420}
              cellCount={ids.length}
              cellRenderer={({ index, key }) => (
                <PostContainer id={ids[index]}>
                  {({ post }) => (
                    <Card
                      width={post.picture.width}
                      height={post.picture.height}
                      imageUrl={post.picture.url}
                    />
                  )}
                </PostContainer>
              )}
            />
          )}
        </PostListContainer>
      </div>
    );
  }
}

export default App;
