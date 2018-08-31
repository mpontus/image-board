import React from "react";
import { Flex, Box } from "grid-styled";
import Waypoint from "react-waypoint";
import {
  Snackbar,
  Header,
  PostCard,
  MasonryLayout,
  Spinner,
} from "./components";
import {
  AuthContainer,
  PostListContainer,
  PostContainer,
  NotificationContainer,
} from "./containers";
import "normalize.css";
import "./App.css";

const App = () => (
  <AuthContainer>
    {({ user, onLogin, onLogout }) => (
      <PostListContainer>
        {({
          isLoading,
          hasMorePosts,
          lastPage,
          ids,
          onCreatePost,
          onEndReached,
        }) => (
          <Flex flexDirection="column">
            <Header
              title="Image Board"
              isAuthenticated={!!user}
              avatarUrl={user && user.avatarUrl}
              onLoginClick={onLogin}
              onCreateClick={file => onCreatePost(file, user)}
              onLogoutClick={() => onLogout()}
            />
            <MasonryLayout
              maxCellWidth={420}
              keyMapper={index => ids[index]}
              cellCount={ids.length}
              cellRenderer={({ index }) => (
                <PostContainer id={ids[index]}>
                  {({ post, onLikePost, onDeletePost }) => (
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
                          onLikePost(post, post.isLiked ? -1 : +1)
                        }
                        onDeleteClick={() => onDeletePost(post)}
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
                  onEnter={() => onEndReached(lastPage)}
                />
              </React.Fragment>
            )}

            {isLoading && (
              <Box alignSelf="center">
                <Spinner size="40" />
              </Box>
            )}
            <NotificationContainer>
              {({ message }) =>
                message ? <Snackbar>{message}</Snackbar> : null
              }
            </NotificationContainer>
          </Flex>
        )}
      </PostListContainer>
    )}
  </AuthContainer>
);

export default App;
