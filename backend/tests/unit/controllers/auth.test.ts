import { expect, vi, describe, it, beforeEach } from "vitest";

vi.mock(import("../../../src/services/auth.service.js"));
vi.mock(import("../../../src/config/env.js"));


import { authController } from "../../../src/controllers/auth.controller.js";
import { authServices } from "../../../src/services/auth.service.js";
import { Request, Response, NextFunction } from "express";
import envVariables from "../../../src/config/env.js";


const buildMockResponse = (): Partial<Response> => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
});

const buildMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
    body: {},
    log: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
    } as any,
    ...overrides,
});


describe("authRegisterController", () => {
    const userData = {
        id: "704efd8b-a791-4021-8236-b336b40153d3",
        name: "tester121",
        email: "tester2111@gmail.com",
        created_at: "2026-05-19T19:21:45.911Z"
    };

    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        vi.clearAllMocks();
        req = buildMockRequest({
            body: { name: "tester121", email: "tester2111@gmail.com", password: "password123" },
        });;
        res = buildMockResponse();
        mockNext = vi.fn();
    })



    it("should register a user", async () => {
        vi.mocked(authServices.authRegisterService).mockResolvedValue(userData);

        await authController.authRegisterController(req as Request, res as Response, mockNext as NextFunction);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(req.log?.info).toHaveBeenCalledWith({ userId: userData.id }, "User registered successfully");
        expect(res.json).toHaveBeenCalledWith({ message: "User registered successfully", user: userData });
        expect(mockNext).not.toHaveBeenCalled();


    });


    it("calls next(error) when error and no response", async () => {
        const error = new Error("Something went wrong");
        vi.mocked(authServices.authRegisterService).mockRejectedValue(error);


        const res = buildMockResponse();
        await authController.authRegisterController(req as Request, res as Response, mockNext as NextFunction);


        expect(mockNext).toHaveBeenCalledWith(error);
        expect(req.log?.info).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();

    });

    it("should call next(AppError) when email already exists", async () => {
        const appError = Object.assign(new Error("Account with this email already exists"), {
            status: 400
        });
        vi.mocked(authServices.authRegisterService).mockRejectedValue(appError);

        await authController.authRegisterController(req as Request, res as Response, mockNext as NextFunction);

        expect(mockNext).toHaveBeenCalledWith(appError);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();


    });
});



describe("authLoginController", () => {
    const user = {
        id: "3831851c-7a17-45ac-a5b5-0e036d3003a5",
        name: "test",
        email: "test@gmail.com",
        created_at: "2026-03-23T11:09:39.359Z",
        updated_at: "2026-03-23T11:09:39.359Z",
        verified_at: "2026-04-25T16:41:24.356Z"
    }
    const accessToken = "sadsadas2XXDADASDASD32312313123";
    const refreshToken = "dsadasdDSDASDA787dasDASDSADAS3";
    const responseData = { accessToken, refreshToken, user };
    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockNext: NextFunction;



    beforeEach(() => {

        vi.resetAllMocks();
        req = buildMockRequest({ body: { email: "test@gmail.com", password: "password123" } });
        res = buildMockResponse();
        mockNext = vi.fn();

    });




    it("should return user data on successfull login", async () => {
        vi.mocked(authServices.authLoginService).mockResolvedValue(responseData);

        await authController.authLoginController(req as Request, res as Response, mockNext as NextFunction);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(req.log?.info).toHaveBeenCalledWith({ userId: user.id }, "User logged in successfully");
        expect(res.json).toHaveBeenCalledWith({ message: "User logged in successfully", user });
        expect(mockNext).not.toHaveBeenCalled();

    })

    it("should set cookies with correct options", async () => {
        vi.mocked(authServices.authLoginService).mockResolvedValue(responseData);

        await authController.authLoginController(req as Request, res as Response, mockNext as NextFunction);

        expect(res.cookie).toHaveBeenCalledWith("accessToken", accessToken, {
            httpOnly: true,
            secure: envVariables.node_env === "production",
            sameSite: envVariables.node_env === "production" ? "strict" : "lax",
            maxAge: 60 * 60 * 1000

        });
        expect(res.cookie).toHaveBeenCalledWith("refreshToken", refreshToken, {
            httpOnly: true,
            secure: envVariables.node_env === "production",
            sameSite: envVariables.node_env == "production" ? "strict" : "lax",
            path: "/api/v1/auth/refresh-token",
            maxAge: 7 * 24 * 60 * 60 * 1000,

        });

        expect(req.log?.info).toHaveBeenCalledWith({ userId: user.id }, "User logged in successfully");
        expect(mockNext).not.toHaveBeenCalled();


    })


    it("should call authLoginServie with full request body", async () => {
        vi.mocked(authServices.authLoginService).mockResolvedValue(responseData);

        await authController.authLoginController(req as Request, res as Response, mockNext as NextFunction);


        expect(authServices.authLoginService).toHaveBeenCalledWith({ email: "test@gmail.com", password: "password123" });
    })




    it("should call next(error when services throws generic error", async () => {
        const error = new Error("Somethign went Wrong");

        vi.mocked(authServices.authLoginService).mockRejectedValue(error);
        await authController.authLoginController(req as Request, res as Response, mockNext as NextFunction);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(res.cookie).not.toHaveBeenCalled();
        expect(req.log?.info).not.toHaveBeenCalled();
    })



    it("should call next(error) when invalid credentials are provided", async () => {
        const appError = Object.assign(new Error("Invalid credentials"), {
            status: 401
        });

        vi.mocked(authServices.authLoginService).mockRejectedValue(appError);

        await authController.authLoginController(req as Request, res as Response, mockNext as NextFunction);

        expect(mockNext).toHaveBeenCalledWith(appError);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(res.cookie).not.toHaveBeenCalled();
        expect(req.log?.info).not.toHaveBeenCalled();
    })

    it("should call next(error) when user is not verified", async () => {
        const appError = Object.assign(new Error("Please verify your email"), {
            status: 403
        });
        vi.mocked(authServices.authLoginService).mockRejectedValue(appError);


        await authController.authLoginController(req as Request, res as Response, mockNext as NextFunction);

        expect(mockNext).toHaveBeenCalledWith(appError);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(res.cookie).not.toHaveBeenCalled();
        expect(req.log?.info).not.toHaveBeenCalled();

    })
})



describe("authRefreshTokenController", () => {

    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockNext: NextFunction;
    const refreshToken = "sadasdDSDASDA787dasDASDSADAS3";

    beforeEach(() => {
        vi.resetAllMocks();
        req = buildMockRequest({ cookies: {} });
        res = buildMockResponse();
        mockNext = vi.fn();
    })
    const newAccessToken = "newAccessToken123"
    const userId = "3831851c-7a17-45ac-a5b5-0e036d3003a5"

    it("should return a new access token for a valid referesh token", async () => {
        req = buildMockRequest({ cookies: { refreshToken: "sadasdDSDASDA787dasDASDSADAS3" } });
        vi.mocked(authServices.authRefreshTokenService).mockResolvedValue({ newAccessToken, userId });


        await authController.authRefreshTokenController(req as Request, res as Response, mockNext as NextFunction);


        expect(req.cookies?.refreshToken).toBeDefined();
        expect(req.log?.info).toHaveBeenCalledWith({ userId }, "Access token refreshed successfully");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(authServices.authRefreshTokenService).toHaveBeenCalledWith(refreshToken);
        expect(res.cookie).toHaveBeenCalledWith("accessToken", newAccessToken, {
            httpOnly: true,
            secure: envVariables.node_env === "production",
            sameSite: envVariables.node_env === "production" ? "strict" : "lax",
            maxAge: 60 * 60 * 1000,
        });

        expect(mockNext).not.toHaveBeenCalled();
    })


    it("should return 401 if refresh token is not provided", async () => {


        await authController.authRefreshTokenController(req as Request, res as Response, mockNext as NextFunction);


        expect(authServices.authRefreshTokenService).not.toHaveBeenCalled();
        expect(res.cookie).not.toHaveBeenCalled();
        expect(req.log?.info).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);

    })

    it("should call next(error) when services throws an app error", async () => {
        const appError = Object.assign(new Error("Invalid refresh token"), {
            status: 401
        })
        req = buildMockRequest({ cookies: { refreshToken: "sadasdDSDASDA787dasDASDSADAS3" } });


        vi.mocked(authServices.authRefreshTokenService).mockRejectedValue(appError);

        await authController.authRefreshTokenController(req as Request, res as Response, mockNext as NextFunction);


        expect(mockNext).toHaveBeenCalledWith(appError);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.cookie).not.toHaveBeenCalled();
        expect(req.log?.info).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();


    })


    it("should call next(error when service throw generic error", async () => {
        const error = new Error("Something went wrong");
        req = buildMockRequest({ cookies: { refreshToken: "sadasdDSDASDA787dasDASDSADAS3" } });

        vi.mocked(authServices.authRefreshTokenService).mockRejectedValue(error);


        await authController.authRefreshTokenController(req as Request, res as Response, mockNext as NextFunction);


        expect(mockNext).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.cookie).not.toHaveBeenCalled();
        expect(req.log?.info).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    })
})



describe("authLogoutController", () => {

    let req: Partial<Request>;
    let res: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        vi.resetAllMocks();
        req = buildMockRequest();
        res = buildMockResponse();
        mockNext = vi.fn();
    })

    it("should clear cookies and return success message", async () => {

        await authController.authLogoutController(req as Request, res as Response, mockNext as NextFunction);

        expect(res.clearCookie).toHaveBeenCalledWith("accessToken", {
            httpOnly: true,
            secure: envVariables.node_env === "production",
            sameSite: envVariables.node_env === "production" ? "strict" : "lax",
        });
        expect(res.clearCookie).toHaveBeenCalledWith("refreshToken", {
            httpOnly: true,
            secure: envVariables.node_env === "production",
            sameSite: envVariables.node_env === "production" ? "strict" : "lax",
            path: "/api/v1/auth/refresh-token",
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockNext).not.toHaveBeenCalled();
        expect(req.log?.info).toHaveBeenCalledWith("User logged out successfully");
    })


    it("should call next(error) when an error occurs", async () => {
        const error = new Error("Something went wrong");
        vi.mocked(res.clearCookie)?.mockImplementationOnce(() => { throw error });

        await authController.authLogoutController(req as Request, res as Response, mockNext as NextFunction);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(req.log?.info).not.toHaveBeenCalled();
    })
})

