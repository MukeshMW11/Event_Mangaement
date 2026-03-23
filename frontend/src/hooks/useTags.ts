import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { createTag, getTags, deleteTag } from "../api/tags.api";
import type { createTagInput, Tag } from "../interfaces/tagInterfaces";

export const useTags = (search?: string, userOnly?: boolean, limit = 20) => {
  return useQuery({
    queryKey: queryKeys.tags(search, userOnly, limit),
    queryFn: () => getTags(search, userOnly, limit),
    staleTime: 1000 * 60 * 5
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation<Tag, Error, createTagInput>({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tagsAll() });
    }
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tagsAll() });
    }
  });
};