import db from "../db/knex.js";
import { createTagType } from "../validators/tags.validators.js";

const getTagsRepository = async (search?:string,limit=20, userId?: string) => {
    try {
        const query = db("tags").select("id","name", "created_by");
        if (search) {
            query.where("name", "ilike", `%${search}%`);
        }
        if (userId) {
            query.where("created_by", userId);
        }

        query.limit(limit);
        const tags = await query;
        return tags;
    } catch (error) {
        if (userId) {
            console.warn("created_by column not found; cannot filter user-owned tags safely");
            return [];
        }

        console.warn("created_by column not found, falling back to all tags");
        const query = db("tags").select("id","name");
        if (search) {
            query.where("name", "ilike", `%${search}%`);
        }
        query.limit(limit);
        const tags = await query;
        return tags;
    }
};

const createTagRepository = async (tagData: createTagType & { created_by?: string }) => {
    try {
        const insertData = { ...tagData };
        if (tagData.created_by) {
            insertData.created_by = tagData.created_by;
        }
        const [tag] = await db("tags").insert(insertData).onConflict("name").merge({ updated_at: db.fn.now() }).returning("*");
        return tag;
    } catch (error) {
        console.warn("created_by column not found, creating tag without owner");
        const { created_by, ...dataWithoutOwner } = tagData;
        const [tag] = await db("tags").insert(dataWithoutOwner).onConflict("name").merge({ updated_at: db.fn.now() }).returning("*");
        return tag;
    }
};


const getTagDetailRepository = async (tagId: string) => {
    const tag = await db("tags").where({ id: tagId }).first();
    return tag;
};



const updateTagDetailRepository = async (tagId: string, tagData: createTagType) => {
    const [tag] = await db("tags").where({ id: tagId }).update({ ...tagData, updated_at: new Date() }).returning("*");
    return tag;
};

const deleteTagDetailRepository = async (tagId: string) => {
    const [tag] = await db("tags").where({ id: tagId }).del().returning("*");
    return tag;
};

export { getTagsRepository, createTagRepository, getTagDetailRepository, updateTagDetailRepository, deleteTagDetailRepository }