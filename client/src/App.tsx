import * as React from "react";
import { PostListContainer, PostContainer } from "./containers";
import { Card } from "./components";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <PostListContainer>
          {({ ids }) => (
            <div>
              {ids.map(id => (
                <PostContainer key={id} id={id}>
                  {({ post }) => (
                    <Card
                      width={post.picture.width}
                      height={post.picture.height}
                      imageUrl={post.picture.url}
                    />
                  )}
                </PostContainer>
              ))}
            </div>
          )}
        </PostListContainer>
      </div>
    );
  }
}

export default App;
