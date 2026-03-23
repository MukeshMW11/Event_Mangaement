import type { createTagInput, Tag } from "../interfaces/tagInterfaces";
import axiosInstance from "../lib/axios";

export const getTags = async (search?: string, userOnly?: boolean, limit = 20) => {
    const params: { limit: number; search?: string; userOnly?: boolean } = { limit };
    const trimmedSearch = search?.trim();
    if (trimmedSearch) params.search = trimmedSearch;
    if (userOnly) params.userOnly = true;

    const res = await axiosInstance.get("/tags", { params });
    return res.data.data;
};

export const createTag = async (data: createTagInput): Promise<Tag> => {
    const res = await axiosInstance.post("/tags", data);
    return res.data.data;
};

export const deleteTag = async (tagId: string) => {
    await axiosInstance.delete(`/tags/${tagId}`);
};



