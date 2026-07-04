import { apiClient } from "@/lib/api/apiClient";
import { API } from "@/lib/api/endpoints";

export const aiClient = {
  async generatePost(title: string) {
    const { data } = await apiClient.post(API.AI.GENERATE_POST, {
      title,
    });

    return data;
  },
};
