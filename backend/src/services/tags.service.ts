import { createTagRepository, deleteTagDetailRepository, getTagDetailRepository, getTagsRepository, updateTagDetailRepository } from "../repositories/tags.repository.js";
import AppError from "../utils/AppError.js";
import { createTagType } from "../validators/tags.validators.js"


const getTagsService = async (search?:string,limit?:number, userId?: string) => {
    const tags = await getTagsRepository(search,limit, userId);
    return tags;
}


const createTagService = async (tagData: createTagType, userId: string) => {
    const tag = await createTagRepository({ ...tagData, created_by: userId });
    if (!tag) throw new AppError("Couldn't create tag", 500);
    return tag;
}



const getTagDetailsService = async (tagId: string) => {
    const tag = await getTagDetailRepository(tagId);
    if (!tag) throw new AppError("Tag not found", 404);
    return tag;
}

const updateTagService = async (tagId: string, tagData: createTagType) => {
    const tag = await updateTagDetailRepository(tagId, tagData);
    if (!tag) throw new AppError("Tag not found", 404);
    return tag;
}


const deleteTagService = async (tagId: string, userId: string) => {
    try {
        const tag = await getTagDetailRepository(tagId);
        if (!tag) throw new AppError("Tag not found", 404);
        if (tag.created_by && tag.created_by !== userId) throw new AppError("You are not authorized to delete this tag", 403);
        await deleteTagDetailRepository(tagId);
        return tag;
    } catch (error) {
        if (error.message.includes("authorized")) throw error;
        console.warn("created_by column not found, allowing deletion");
        const tag = await getTagDetailRepository(tagId);
        if (!tag) throw new AppError("Tag not found", 404);
        await deleteTagDetailRepository(tagId);
        return tag;
    }
}


export { getTagsService, createTagService, getTagDetailsService, updateTagService, deleteTagService };