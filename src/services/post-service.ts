import type {
  Post,
  PaginatedResponse,
  QueryParams,
  ApiResponse,
} from "@/types";
import {
  MOCK_POSTS,
  MOCK_CATEGORIES,
  MOCK_TAGS,
  MOCK_USERS,
} from "@/mock/data";

// Simulates network delay for realistic UX
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function paginate<T>(items: T[], page = 1, limit = 10): PaginatedResponse<T> {
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export const postService = {
  async getPosts(params: QueryParams = {}): Promise<PaginatedResponse<Post>> {
    await delay();
    let filtered = [...MOCK_POSTS];

    // Status filter
    if (params.status && params.status !== "all") {
      filtered = filtered.filter((p) => p.status === params.status);
    }

    // Category filter
    if (params.category) {
      filtered = filtered.filter((p) => p.category.slug === params.category);
    }

    // Tag filter
    if (params.tag) {
      filtered = filtered.filter((p) =>
        p.tags.some((t) => t.slug === params.tag),
      );
    }

    // Author filter
    if (params.author) {
      filtered = filtered.filter((p) => p.author.id === params.author);
    }

    // Search
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q),
      );
    }

    // Sort
    if (params.sort === "views") {
      filtered.sort((a, b) => b.viewCount - a.viewCount);
    } else if (params.sort === "likes") {
      filtered.sort((a, b) => b.likeCount - a.likeCount);
    } else if (params.sort === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } else {
      // Default: newest
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return paginate(filtered, params.page, params.limit || 9);
  },

  async getFeaturedPosts(): Promise<Post[]> {
    await delay(200);
    return MOCK_POSTS.filter(
      (p) => p.isFeatured && p.status === "published",
    ).slice(0, 3);
  },

  async getTrendingPosts(): Promise<Post[]> {
    await delay(200);
    return MOCK_POSTS.filter((p) => p.isTrending && p.status === "published")
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 6);
  },

  async getLatestPosts(limit = 6): Promise<Post[]> {
    await delay(200);
    return MOCK_POSTS.filter((p) => p.status === "published")
      .sort(
        (a, b) =>
          new Date(b.publishedAt!).getTime() -
          new Date(a.publishedAt!).getTime(),
      )
      .slice(0, limit);
  },

  async getPost(slug: string): Promise<Post | null> {
    await delay(250);
    return MOCK_POSTS.find((p) => p.slug === slug) ?? null;
  },

  async getRelatedPosts(postId: string, categoryId: string): Promise<Post[]> {
    await delay(200);
    return MOCK_POSTS.filter(
      (p) =>
        p.id !== postId &&
        p.category.id === categoryId &&
        p.status === "published",
    ).slice(0, 3);
  },

  async createPost(data: Partial<Post>): Promise<ApiResponse<Post>> {
    await delay(500);
    const newPost: Post = {
      id: `p${Date.now()}`,
      title: data.title ?? "Untitled",
      slug: data.slug ?? `untitled-${Date.now()}`,
      excerpt: data.excerpt ?? "",
      content: data.content ?? "",
      status: data.status ?? "draft",
      author: MOCK_USERS[0],
      category: MOCK_CATEGORIES[0],
      tags: [],
      readingTime: 5,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      bookmarkCount: 0,
      isFeatured: false,
      isTrending: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    MOCK_POSTS.unshift(newPost);
    return {
      success: true,
      data: newPost,
      message: "Post created successfully",
    };
  },

  async updatePost(
    id: string,
    data: Partial<Post>,
  ): Promise<ApiResponse<Post>> {
    await delay(400);
    const idx = MOCK_POSTS.findIndex((p) => p.id === id);
    if (idx === -1)
      return { success: false, data: MOCK_POSTS[0], message: "Post not found" };
    MOCK_POSTS[idx] = {
      ...MOCK_POSTS[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return {
      success: true,
      data: MOCK_POSTS[idx],
      message: "Post updated successfully",
    };
  },

  async deletePost(id: string): Promise<ApiResponse<null>> {
    await delay(300);
    const idx = MOCK_POSTS.findIndex((p) => p.id === id);
    if (idx !== -1) MOCK_POSTS.splice(idx, 1);
    return { success: true, data: null, message: "Post deleted successfully" };
  },
};

export const categoryService = {
  async getCategories() {
    await delay(200);
    return MOCK_CATEGORIES;
  },
  async getCategory(slug: string) {
    await delay(200);
    return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  },
};

export const tagService = {
  async getTags() {
    await delay(200);
    return MOCK_TAGS;
  },
  async getTag(slug: string) {
    await delay(200);
    return MOCK_TAGS.find((t) => t.slug === slug) ?? null;
  },
};
