import React from "react";
import { Header, PostCard } from "./components";
import { AuthContainer, PostListContainer, PostContainer } from "./containers";
import { fileToDataUrl } from "./utils";
import "normalize.css";
import "./App.css";

const App = () => (
  <AuthContainer>
    {({ user, login, logout }) => (
      <PostListContainer>
        {({ ids, createPost }) => (
          <div>
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
            <div>
              {ids.map(id => (
                <PostContainer id={id} key={id}>
                  {({ post, likePost, deletePost }) => (
                    <PostCard
                      imageUrl={post.imageUrl}
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
                  )}
                </PostContainer>
              ))}
            </div>
          </div>
        )}
      </PostListContainer>
    )}
  </AuthContainer>
);

export default App;
