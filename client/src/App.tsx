import * as React from "react";
import "./App.css";
import { PostListContainer, PostContainer } from "./containers";
import logoSvg from "./logo.svg";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logoSvg} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

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
