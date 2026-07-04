import type {
  Comment,
  PaginatedResponse,
  QueryParams,
  ApiResponse,
} from "@/types";
import { MOCK_COMMENTS } from "@/mock/data";

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

export const commentService = {
  async getComments(
    params: QueryParams = {},
  ): Promise<PaginatedResponse<Comment>> {
    await delay();
    let filtered = [...MOCK_COMMENTS];
    if (params.status && params.status !== "all") {
      filtered = filtered.filter((c) => c.status === params.status);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.content.toLowerCase().includes(q) ||
          c.author.name.toLowerCase().includes(q),
      );
    }
    return paginate(filtered, params.page, params.limit || 10);
  },

  async getPostComments(postId: string): Promise<Comment[]> {
    await delay(200);
    return MOCK_COMMENTS.filter(
      (c) => c.postId === postId && c.status === "approved",
    );
  },

  async approveComment(id: string): Promise<ApiResponse<Comment>> {
    await delay(300);
    const comment = MOCK_COMMENTS.find((c) => c.id === id);
    if (!comment)
      return { success: false, data: MOCK_COMMENTS[0], message: "Not found" };
    comment.status = "approved";
    return { success: true, data: comment, message: "Comment approved" };
  },

  async rejectComment(id: string): Promise<ApiResponse<Comment>> {
    await delay(300);
    const comment = MOCK_COMMENTS.find((c) => c.id === id);
    if (!comment)
      return { success: false, data: MOCK_COMMENTS[0], message: "Not found" };
    comment.status = "rejected";
    return { success: true, data: comment, message: "Comment rejected" };
  },

  async deleteComment(id: string): Promise<ApiResponse<null>> {
    await delay(300);
    const idx = MOCK_COMMENTS.findIndex((c) => c.id === id);
    if (idx !== -1) MOCK_COMMENTS.splice(idx, 1);
    return { success: true, data: null, message: "Comment deleted" };
  },
};
