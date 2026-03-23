import { Router } from "express";
import { rsvpsController } from "../controllers/rsvps.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";

const rsvpsRouter = Router();


rsvpsRouter.get('/:eventId', rsvpsController.getRsvpsEvent);
rsvpsRouter.post('/:eventId',authenticateUser, rsvpsController.rsvpsEvent);


export default rsvpsRouter;