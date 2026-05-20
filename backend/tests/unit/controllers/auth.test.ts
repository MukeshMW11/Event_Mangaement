import { expect, vi } from "vitest";

vi.mock(import("../../../src/services/auth.service.js"));
import { describe, it } from "vitest";
import { authController } from "../../../src/controllers/auth.controller.js";
import { authServices } from "../../../src/services/auth.service.js";
import { Request, Response, NextFunction } from "express";
import { mock } from "node:test";

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


    vi.mocked(authServices.authRegisterService).mockResolvedValue(userData);

    it("should register a user", async () => {
        const req = buildMockRequest({
            body: { name: "tester121", email: "tester2111@gmail.com", password: "password123" }
        });

        const res = buildMockResponse();

        await authController.authRegisterController(req as Request, res as Response, mockNext as NextFunction);

        expect(res.status).toHaveBeenCalledWith(201);
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

        expect(mockNext).toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalledWith(appError);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();


    })
})

