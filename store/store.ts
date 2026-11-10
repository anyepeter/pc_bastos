import { configureStore } from '@reduxjs/toolkit';
import blogReducer, { initialBlogState } from './blogSlice';
import type { Language } from '@/lib/translations';

/** `language` is the page's, read from its address (see app/[lang]/layout.tsx). */
export const makeStore = (language: Language = 'en') => {
  return configureStore({
    reducer: {
      blog: blogReducer,
    },
    preloadedState: { blog: { ...initialBlogState, language } },
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
