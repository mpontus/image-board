import React, { Component } from "react";
import { Header, PostCard } from "./components";
import { AuthContainer, PostListContainer, PostContainer } from "./containers";
import { fileToDataUrl } from "./utils";

const App = () => (
  <div>
    <AuthContainer>
      {({ user, login, logout }) => (
        <PostListContainer>
          {({ createPost }) => (
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
              onAvatarClick={() => logout()}
            />
          )}
        </PostListContainer>
      )}
    </AuthContainer>
    <ul>
      <AuthContainer>
        {({ user }) => (
          <PostListContainer>
            {({ ids }) =>
              ids.map(id => (
                <PostContainer id={id} key={id}>
                  {({ post, likePost, deletePost }) => (
                    <PostCard
                      imageUrl={post.imageUrl}
                      avatarUrl={post.author.avatarUrl}
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
                      onLikeToggle={() => likePost(post)}
                      onDeleteClick={() => deletePost(post)}
                      onAuthorClick={() => console.log("go to author page")}
                    />
                  )}
                </PostContainer>
              ))
            }
          </PostListContainer>
        )}
      </AuthContainer>
    </ul>
  </div>
);

export default App;
