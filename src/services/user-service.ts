import type {
  User,
  PaginatedResponse,
  QueryParams,
  ApiResponse,
} from "@/types";
import { MOCK_USERS } from "@/mock/data";

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

export const userService = {
  async getUsers(params: QueryParams = {}): Promise<PaginatedResponse<User>> {
    await delay();
    let filtered = [...MOCK_USERS];
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }
    if (params.status && params.status !== "all") {
      filtered = filtered.filter((u) => u.status === params.status);
    }
    return paginate(filtered, params.page, params.limit || 10);
  },

  async getUser(id: string): Promise<User | null> {
    await delay(200);
    return MOCK_USERS.find((u) => u.id === id) ?? null;
  },

  async getUserBySlug(slug: string): Promise<User | null> {
    await delay(200);
    return (
      MOCK_USERS.find(
        (u) =>
          u.name.toLowerCase().replace(/\s+/g, "-") === slug ||
          (u as unknown as { slug?: string }).slug === slug,
      ) ?? null
    );
  },

  async updateUser(
    id: string,
    data: Partial<User>,
  ): Promise<ApiResponse<User>> {
    await delay(400);
    const idx = MOCK_USERS.findIndex((u) => u.id === id);
    if (idx === -1)
      return { success: false, data: MOCK_USERS[0], message: "User not found" };
    MOCK_USERS[idx] = {
      ...MOCK_USERS[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("current_user", JSON.stringify(MOCK_USERS[idx]));
    return {
      success: true,
      data: MOCK_USERS[idx],
      message: "Profile updated successfully",
    };
  },

  async deleteUser(id: string): Promise<ApiResponse<null>> {
    await delay(300);
    const idx = MOCK_USERS.findIndex((u) => u.id === id);
    if (idx !== -1) MOCK_USERS.splice(idx, 1);
    return { success: true, data: null, message: "User deleted" };
  },

  async suspendUser(id: string): Promise<ApiResponse<User>> {
    await delay(300);
    const user = MOCK_USERS.find((u) => u.id === id);
    if (!user)
      return { success: false, data: MOCK_USERS[0], message: "User not found" };
    user.status = "suspended";
    return { success: true, data: user, message: "User suspended" };
  },

  async getAuthors(): Promise<User[]> {
    await delay(200);
    return MOCK_USERS.filter(
      (u) => u.role === "author" || u.role === "editor" || u.role === "admin",
    );
  },
};
