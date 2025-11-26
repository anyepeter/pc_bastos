import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './blogSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      blog: blogReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these paths in the state for serializable check
          ignoredActions: ['blog/setPosts', 'blog/setCurrentPost'],
          ignoredPaths: ['blog.posts', 'blog.currentPost'],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
