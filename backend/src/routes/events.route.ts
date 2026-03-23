import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import { eventsConrtollers } from "../controllers/events.controller.js";
import validateData from "../middlewares/validator.middleware.js";
import { createEventSchema, editEventSchema } from "../validators/events.validators.js";


const eventRouter = Router();

eventRouter.get("/", eventsConrtollers.getEvents);
eventRouter.get("/:eventId",authenticateUser, eventsConrtollers.eventDetails);
eventRouter.post("/", authenticateUser, validateData(createEventSchema), eventsConrtollers.createEvent);
eventRouter.patch("/:eventId", authenticateUser, validateData(editEventSchema), eventsConrtollers.updateEvent);
eventRouter.delete("/:eventId", authenticateUser, eventsConrtollers.deleteEvent);


export default eventRouter;