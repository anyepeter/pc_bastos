import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getPublishedBlogPosts, getPublishedBlogPostBySlug, PublicBlogPost } from '@/app/actions/blog-public';
import { Language } from '@/lib/translations';

interface BlogState {
  posts: PublicBlogPost[];
  currentPost: PublicBlogPost | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  cacheExpiry: number; // Cache duration in milliseconds (5 minutes)
  language: Language; // Current language selection
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
  language: 'en', // Default to English
};

/**
 * Async thunk to fetch all published blog posts
 * Only fetches if cache is expired or empty
 */
export const fetchBlogPosts = createAsyncThunk<
  { data: PublicBlogPost[]; fromCache: boolean },
  void,
  { state: { blog: BlogState } }
>(
  'blog/fetchPosts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { blog: BlogState };
      const now = Date.now();

      // Check if we have cached data and it's still valid
      if (
        state.blog.posts.length > 0 &&
        state.blog.lastFetched &&
        now - state.blog.lastFetched < state.blog.cacheExpiry
      ) {
        // Return cached data
        return { data: state.blog.posts, fromCache: true };
      }

      // Fetch fresh data from server
      const result = await getPublishedBlogPosts();

      if (!result.success) {
        return rejectWithValue(result.error || 'Failed to fetch blog posts');
      }

      return { data: result.data, fromCache: false };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

/**
 * Async thunk to fetch a single blog post by slug
 * First checks Redux cache, then fetches from server if needed
 */
export const fetchBlogPostBySlug = createAsyncThunk(
  'blog/fetchPostBySlug',
  async (slug: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { blog: BlogState };

      // Check if post exists in cache
      const cachedPost = state.blog.posts.find((post) => post.slug === slug);
      if (cachedPost) {
        return { data: cachedPost, fromCache: true };
      }

      // Fetch from server
      const result = await getPublishedBlogPostBySlug(slug);

      if (!result.success || !result.data) {
        return rejectWithValue(result.error || 'Blog post not found');
      }

      return { data: result.data, fromCache: false };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Clear current post
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    // Manually set posts (for SSR initial data)
    setPosts: (state, action: PayloadAction<PublicBlogPost[]>) => {
      state.posts = action.payload;
      state.lastFetched = Date.now();
      state.error = null;
    },
    // Manually set current post (for SSR initial data)
    setCurrentPost: (state, action: PayloadAction<PublicBlogPost>) => {
      state.currentPost = action.payload;
      state.error = null;
    },
    // Invalidate cache
    invalidateCache: (state) => {
      state.lastFetched = null;
    },
    // Set language
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch blog posts
    builder
      .addCase(fetchBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.fromCache) {
          state.posts = action.payload.data;
          state.lastFetched = Date.now();
        }
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch single blog post
    builder
      .addCase(fetchBlogPostBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPostBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload.data;

        // Add to posts cache if not already there
        if (!action.payload.fromCache) {
          const exists = state.posts.find((p) => p.id === action.payload.data.id);
          if (!exists) {
            state.posts.push(action.payload.data);
          }
        }
      })
      .addCase(fetchBlogPostBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentPost = null;
      });
  },
});

export const { clearError, clearCurrentPost, setPosts, setCurrentPost, invalidateCache, setLanguage } = blogSlice.actions;
export default blogSlice.reducer;
