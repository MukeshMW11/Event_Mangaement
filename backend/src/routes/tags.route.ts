import { Router } from "express";
import { createTagController, deleteTagController, getTagsController, getTagDetailsController, updateTagController } from "../controllers/tags.controller.js";
import validateData from "../middlewares/validator.middleware.js";
import { createTagSchema } from "../validators/tags.validators.js";

const tagRouter = Router();


tagRouter.get("/", getTagsController);
tagRouter.post("/", validateData(createTagSchema), createTagController);
tagRouter.get("/:tagId", getTagDetailsController);
tagRouter.patch("/:tagId", validateData(createTagSchema), updateTagController);
tagRouter.delete("/:tagId", deleteTagController);


export default tagRouter;