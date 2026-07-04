import { apiClient } from "@/lib/api/apiClient";
import { API } from "@/lib/api/endpoints";
import { Tag } from "@/types/tag";

export const TagService = {
  async getAll(search?: string) {
    const res = await apiClient.get(API.TAGS.LIST, {
      params: { search },
    });
    return res.data.tags as Tag[];
  },

  async create(data: { name: string; slug: string }) {
    const res = await apiClient.post(API.TAGS.CREATE, data);

    console.log({ res });

    return res.data.tag as Tag;
  },

  async update(id: string, data: Partial<Tag>) {
    const res = await apiClient.put(API.TAGS.UPDATE(id), data);
    return res.data.tag as Tag;
  },

  async delete(id: string) {
    await apiClient.delete(API.TAGS.DELETE(id));
  },
};
