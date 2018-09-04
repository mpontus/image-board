import * as React from "react";
import { PostListContainer, PostContainer } from "./containers";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <PostListContainer>
          {({ ids }) => (
            <div>
              {ids.map(id => (
                <PostContainer key={id} id={id}>
                  {({ post }) => <div data-cy="card">{post.picture.url}</div>}
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
