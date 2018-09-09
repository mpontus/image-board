import * as React from "react";
import { Card, Header, MasonryLayout } from "./components";
import { AuthContainer, PostContainer, PostListContainer } from "./containers";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <AuthContainer>
          {({ user, onLogin, onLogout }) => (
            <PostListContainer>
              {({ onCreatePost }) => (
                <Header
                  isAuthenticated={user !== null}
                  onLoginClick={onLogin}
                  onLogoutClick={onLogout}
                  onFileChange={e => {
                    if (user && e.currentTarget.files) {
                      onCreatePost(e.currentTarget.files[0], user);
                    }
                  }}
                />
              )}
            </PostListContainer>
          )}
        </AuthContainer>
        <AuthContainer>
          {({ user, onLogin, onLogout }) => (
            <PostListContainer>
              {({ ids, onDeletePost, onLikePost }) => (
                <MasonryLayout
                  gutter={10}
                  maxCellWidth={420}
                  cellCount={ids.length}
                  cellRenderer={({ index }) => (
                    <PostContainer id={ids[index]}>
                      {({ post }) =>
                        post ? (
                          <Card
                            authorName={post.author.name}
                            authorAvatarUrl={post.author.avatarUrl}
                            width={post.picture.width}
                            height={post.picture.height}
                            imageUrl={post.picture.url}
                            likeCount={post.likesCount}
                            isLiked={post.isLiked}
                            canLike={user !== null}
                            onLikeToggle={() =>
                              onLikePost(post, post.isLiked ? -1 : 1)
                            }
                            canDelete={
                              user !== null && user.id === post.author.id
                            }
                            onDeleteClick={() => onDeletePost(post)}
                          />
                        ) : null
                      }
                    </PostContainer>
                  )}
                />
              )}
            </PostListContainer>
          )}
        </AuthContainer>
      </div>
    );
  }
}

export default App;
