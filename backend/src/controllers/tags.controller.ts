import { Request, Response, NextFunction } from "express";
import { createTagService, deleteTagService, getTagDetailsService, getTagsService, updateTagService } from "../services/tags.service.js";

const getTagsController = async (req: Request, res: Response, next: NextFunction) => {
    const { search, userOnly } = req.query;
    const parsedLimit = Number(req.query.limit ?? 20);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 20;
    const userId = userOnly ? (req as any).user?.userId : undefined;
    try {
        const tags = await getTagsService(search,limit, userId);
        req.log.info("Tags fetched successfully");
        return res.status(200).json({ message: "Tags fetched successsfully", data: tags });
    }
    catch (error) {
        next(error)
    };

};

const createTagController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.userId;
        const tag = await createTagService(req.body, userId);
        req.log.info("Tags created successfully");
        return res.status(201).json({ message: "Tags created successfully", data: tag });

    } catch (error) {
        next(error);
    }
};

const getTagDetailsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tagId = req.params.tagId as string;

        const tag = await getTagDetailsService(tagId);
        req.log.info({ tagId }, "Tag successfully fetched");
        return res.status(200).json({ message: "Tag successfully fetched", data: tag });

    } catch (error) {
        next(error);
    }
};


const updateTagController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tagId = req.params.tagId as string;
        const tag = await updateTagService(tagId, req.body);
        req.log.warn({ tagId }, "Tag successfully updated");
        return res.status(200).json({ message: "Tag successfully updated", data: tag });
    }
    catch (error) {
        next(error);
    }
};
const deleteTagController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tagId = req.params.tagId as string;
        const userId = (req as any).user?.userId;
        const tag = await deleteTagService(tagId, userId);
        req.log.warn({ tagId }, "Tag successfully deleted");
        return res.status(204).send();

    } catch (error) {
        next(error);
    }
}

export {
    getTagsController, createTagController, getTagDetailsController, updateTagController, deleteTagController
};