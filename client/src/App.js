import React from "react";
import { Flex, Box } from "grid-styled";
import Waypoint from "react-waypoint";
import { Header, PostCard, MasonryLayout, Spinner } from "./components";
import { AuthContainer, PostListContainer, PostContainer } from "./containers";
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
              onCreateClick={file => createPost(file, user)}
              onLogoutClick={() => logout()}
            />
            <MasonryLayout
              maxCellWidth={420}
              keyMapper={index => ids[index]}
              cellCount={ids.length}
              cellRenderer={({ index }) => (
                <PostContainer id={ids[index]}>
                  {({ post, likePost, deletePost }) => (
                    <div style={{ overflow: "hidden" }}>
                      <PostCard
                        committed={post.committed}
                        imageUrl={post.imageUrl}
                        imageWidth={post.imageWidth}
                        imageHeight={post.imageHeight}
                        avatarUrl={post.author.avatarUrl}
                        authorName={post.author.name}
                        likesCount={post.likes}
                        isLiked={post.isLiked}
                        canDelete={user && user.id === post.author.id}
                        bytesTransferred={
                          post.progress && post.progress.bytesTransferred
                        }
                        bytesTotal={post.progress && post.progress.bytesTotal}
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
            {hasMorePosts && (
              <React.Fragment>
                <Waypoint
                  key={`posts-${ids.length}`}
                  onEnter={() => endReached(lastPage)}
                />

                <Box alignSelf="center">
                  <Spinner size="40" />
                </Box>
              </React.Fragment>
            )}
          </Flex>
        )}
      </PostListContainer>
    )}
  </AuthContainer>
);

export default App;
