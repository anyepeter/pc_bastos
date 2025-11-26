'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store/store';
import { setPosts, setCurrentPost } from '@/store/blogSlice';
import type { PublicBlogPost } from '@/app/actions/blog-public';

interface StoreProviderProps {
  children: React.ReactNode;
  initialBlogPosts?: PublicBlogPost[];
  initialCurrentPost?: PublicBlogPost;
}

export default function StoreProvider({ children, initialBlogPosts, initialCurrentPost }: StoreProviderProps) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();

    // Initialize the store with server-side data if available
    if (initialBlogPosts && initialBlogPosts.length > 0) {
      storeRef.current.dispatch(setPosts(initialBlogPosts));
    }

    // Initialize current post if provided
    if (initialCurrentPost) {
      storeRef.current.dispatch(setCurrentPost(initialCurrentPost));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
