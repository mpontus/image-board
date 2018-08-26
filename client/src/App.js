import React from "react";
import { Flex, Box } from "grid-styled";
import Waypoint from "react-waypoint";
import { Header, PostCard, MasonryLayout, Spinner } from "./components";
import { AuthContainer, PostListContainer, PostContainer } from "./containers";
import { fileToDataUrl } from "./utils";
import "normalize.css";
import "./App.css";

const App = () => (
  <AuthContainer>
    {({ user, login, logout }) => (
      <PostListContainer fetch>
        {({ hasMorePosts, lastPage, ids, createPost, endReached }) => (
          <Flex flexDirection="column">
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
                        canDelete={user && user.id === post.author.id}
                        bytesUploaded={
                          post.progress && post.progress.bytesTransferred
                        }
                        bytesTotal={post.progress && post.progress.totalBytes}
                        errorMessage={post.error && post.error.message}
                        onLikeToggle={() =>
                          likePost(post, post.isLiked ? -1 : +1)
                        }
                        onDeleteClick={() => deletePost(post)}
                      />
                    </div>
                  )}
                </PostContainer>
              )}
            />
            {ids.length > 0 && (
              <Waypoint
                key={`posts-${ids.length}`}
                onEnter={() => endReached(lastPage)}
              />
            )}
            {hasMorePosts && (
              <Box alignSelf="center">
                <Spinner size="40" />
              </Box>
            )}
          </Flex>
        )}
      </PostListContainer>
    )}
  </AuthContainer>
);

export default App;
