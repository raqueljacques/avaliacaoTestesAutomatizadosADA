const SessionController = require("../../../../src/controllers/session-ctrl");
const SessionService = require("../../../../src/services/session-service");
const UserService = require("../../../../src/services/user-service");
const EmailValidator = require("../../../../src/utils/email-validator");

describe("Session controller test", () => {
    test("should create a session", async () => {
        const req = {
            body: {
                email: "any@email.com",
                password: "any_password",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const isValidSpy = jest
            .spyOn(EmailValidator, "isValid")
            .mockReturnValue(true);

        const userExistsAndCheckPasswordSpy = jest
            .spyOn(UserService, "userExistsAndCheckPassword")
            .mockResolvedValue(true);

        const generateTokenSpy = jest
            .spyOn(SessionService, "generateToken")
            .mockResolvedValue("any_token");

        await SessionController.create(req, res);

        expect(isValidSpy).toHaveBeenCalledWith(req.body.email);
        expect(userExistsAndCheckPasswordSpy).toHaveBeenCalledWith(req.body);
        expect(generateTokenSpy).toHaveBeenCalledWith({
            email: req.body.email,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toBeCalledWith({ token: "any_token" });
    });

    test("should return 400 when email is invalid", async () => {
        const req = {
            body: {
                email: "invalid_email",
                password: "any_password",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const isValidSpy = jest
            .spyOn(EmailValidator, "isValid")
            .mockReturnValue(false);

        await SessionController.create(req, res);

        expect(isValidSpy).toHaveBeenCalledWith(req.body.email);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith("Email inválido");
    });

    test("should return 400 when password is invalid", async () => {
        const req = {
            body: {
                email: "any_email",
                password: null,
            },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const isValidSpy = jest
            .spyOn(EmailValidator, "isValid")
            .mockReturnValue(true);

        await SessionController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith("Senha inválida");
    });

    test("should return 404 when user does not exist", async () => {
        const req = {
            body: {
                email: "any_email",
                password: "any_password",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const isValidSpy = jest
            .spyOn(EmailValidator, "isValid")
            .mockReturnValue(true);

        const userExistsAndCheckPasswordSpy = jest
            .spyOn(UserService, "userExistsAndCheckPassword")
            .mockResolvedValue(false);

        await SessionController.create(req, res);

        expect(isValidSpy).toHaveBeenCalledWith(req.body.email);
        expect(userExistsAndCheckPasswordSpy).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith("Usuário não encontrado");
    });

    test("should return 500 when any error occurs", async () => {
        const req = {
            body: {
                email: "any_email",
                password: "any_password",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const isValidSpy = jest
            .spyOn(EmailValidator, "isValid")
            .mockReturnValue(true);

        const userExistsAndCheckPasswordSpy = jest
            .spyOn(UserService, "userExistsAndCheckPassword")
            .mockRejectedValue(new Error());

        await SessionController.create(req, res);

        expect(isValidSpy).toHaveBeenCalledWith(req.body.email);
        expect(userExistsAndCheckPasswordSpy).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith("Server Error");
    });
});
