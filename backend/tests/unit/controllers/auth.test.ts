import { expect, vi, describe, it } from "vitest";

vi.mock(import("../../../src/services/auth.service.js"));
vi.mock(import("../../../src/config/env.js"));

import { authController } from "../../../src/controllers/auth.controller.js";
import { authServices } from "../../../src/services/auth.service.js";
import { Request, Response, NextFunction } from "express";
import envVariables from "../../../src/config/env.js";

console.log("The mocked env variables are :", envVariables);

const buildMockResponse = (): Partial<Response> => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
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

const mockNext: NextFunction = vi.fn();

describe("authRegisterController", () => {
    const userData = {
        id: "704efd8b-a791-4021-8236-b336b40153d3",
        name: "tester121",
        email: "tester2111@gmail.com",
        created_at: "2026-05-19T19:21:45.911Z"
    };



    it("should register a user", async () => {
        vi.mocked(authServices.authRegisterService).mockResolvedValue(userData);

        const req = buildMockRequest({
            body: { name: "tester121", email: "tester2111@gmail.com", password: "password123" },
        });

        const res = buildMockResponse();

        await authController.authRegisterController(req as Request, res as Response, mockNext as NextFunction);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(req.log?.info).toHaveBeenCalledWith({ userId: userData.id }, "User registered successfully");
        expect(res.json).toHaveBeenCalledWith({ message: "User registered successfully", user: userData });
        expect(mockNext).not.toHaveBeenCalled();


    });


    it("calls next(error) when error and no response", async () => {
        const error = new Error("Something went wrong");
        vi.mocked(authServices.authRegisterService).mockRejectedValue(error);

        const req = buildMockRequest({
            body: { name: "tester121", email: "test@123gmail.com", password: "password123" }
        });
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
        const req = buildMockRequest({ body: { name: "tester121", email: "tester2111@gmail.com", password: "password123" } });
        const res = buildMockResponse();


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

    const req = buildMockRequest({ body: { email: "test@gmail.com", password: "password123" } });
    const res = buildMockResponse();

    it("should return user data on successfull login", async () => {




        vi.mocked(authServices.authLoginService).mockResolvedValue(responseData);

        await authController.authLoginController(req as Request, res as Response, mockNext as NextFunction);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(req.log?.info).toHaveBeenCalledWith({ userId: user.id }, "User logged in successfully");
        expect(res.json).toHaveBeenCalledWith({ message: "User logged in successfully", user });

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

        })


    })


    it("should return user data excluding the password on successful login", async () => {

    })



    it("calls next(error) when error and no response", async () => {

    })
})







