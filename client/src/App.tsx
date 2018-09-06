import * as React from "react";
import { AuthContainer, PostListContainer, PostContainer } from "./containers";
import { Header, MasonryLayout, Card } from "./components";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <AuthContainer>
          {({ user, onLogin, onLogout }) => (
            <PostListContainer>
              {({ createPost }) => (
                <Header
                  isAuthenticated={user !== null}
                  onLoginClick={onLogin}
                  onLogoutClick={onLogout}
                  onFileChange={e => {
                    if (user && e.currentTarget.files) {
                      createPost(e.currentTarget.files[0], user);
                    }
                  }}
                />
              )}
            </PostListContainer>
          )}
        </AuthContainer>
        <PostListContainer>
          {({ ids }) => (
            <MasonryLayout
              gutter={10}
              maxCellWidth={420}
              cellCount={ids.length}
              cellRenderer={({ index, key }) => (
                <PostContainer id={ids[index]}>
                  {({ post }) =>
                    post ? (
                      <Card
                        width={post.picture.width}
                        height={post.picture.height}
                        imageUrl={post.picture.url}
                      />
                    ) : null
                  }
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
