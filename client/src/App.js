import React from "react";
import { Header, PostCard, MasonryLayout } from "./components";
import { AuthContainer, PostListContainer, PostContainer } from "./containers";
import { fileToDataUrl } from "./utils";
import "normalize.css";
import "./App.css";

const App = () => (
  <AuthContainer>
    {({ user, login, logout }) => (
      <PostListContainer>
        {({ ids, createPost }) => (
          <React.Fragment>
            <Header
              title="Image Board"
              isAuthenticated={!!user}
              avatarUrl={user && user.avatarUrl}
              onTitleClick={() => console.log("go home")}
              onLoginClick={login}
              onCreateClick={file =>
                fileToDataUrl(file).then(dataUrl =>
                  createPost(file, dataUrl, user)
                )
              }
              onLogoutClick={() => logout()}
            />
            <MasonryLayout
              maxCellWidth={420}
              cellCount={ids.length}
              cellRenderer={({ index }) => (
                <PostContainer id={ids[index]}>
                  {({ post, likePost, deletePost }) => (
                    <div style={{ overflow: "hidden" }}>
                      <PostCard
                        imageUrl={post.imageUrl}
                        imageWidth={post.imageWidth}
                        imageHeight={post.imageHeight}
                        avatarUrl={post.author.avatarUrl}
                        authorName={post.author.name}
                        likesCount={post.likes}
                        isLiked={post.isLiked}
                        canDelete={
                          /// TODO: We don't know user id from JWT token
                          user && user.id === post.author.id
                        }
                        bytesUploaded={
                          post.progress && post.progress.bytesTransferred
                        }
                        bytesTotal={post.progress && post.progress.totalBytes}
                        errorMessage={post.error && post.error.message}
                        onLikeToggle={() =>
                          likePost(post, post.isLiked ? -1 : +1)
                        }
                        onDeleteClick={() => deletePost(post)}
                        onAuthorClick={() => console.log("go to author page")}
                      />
                    </div>
                  )}
                </PostContainer>
              )}
            />
          </React.Fragment>
        )}
      </PostListContainer>
    )}
  </AuthContainer>
);

export default App;
