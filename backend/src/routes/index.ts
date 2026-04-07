import { Router } from 'express';
import authRoute from './auth.route.js';
import tagRouter from './tags.route.js';
import eventRouter from './events.route.js';
import authenticateUser from '../middlewares/auth.middleware.js';
import rsvpsRouter from './rsvps.route.js';
import verificationRouter from './verification.route.js';

const routes = Router();

routes.use("/auth", authRoute);
routes.use("/tags", authenticateUser, tagRouter);
routes.use("/events", eventRouter);
routes.use("/rsvps", rsvpsRouter);
routes.use("/verification", verificationRouter);


export default routes;