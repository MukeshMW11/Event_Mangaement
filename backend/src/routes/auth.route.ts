import { Router } from "express";
import validateData from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validators.js";
import { authController } from "../controllers/auth.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";

const authRoute = Router();


authRoute.post('/login', validateData(loginSchema), authController.authLoginController);
authRoute.post('/register', validateData(registerSchema), authController.authRegisterController);
authRoute.get("/me",authenticateUser,authController.getCurrentUser)


authRoute.post('/refresh-token', authController.authRefreshTokenController);
authRoute.post("/logout", authController.authLogoutController);



export default authRoute;