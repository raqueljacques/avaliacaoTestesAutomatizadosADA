const UserCtrl = require("../../../../src/controllers/user-ctrl");
const UserService = require("../../../../src/services/user-service");
const EmailValidator = require("../../../../src/utils/email-validator");

describe("User controller test", () => {
    test("should create a user", async () => {
        mockUser = {
            name: "any_name",
            email: "any@mail.com",
            password: "any_password",
        };

        const req = {
            body: mockUser,
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const isValidSpy = jest
            .spyOn(EmailValidator, "isValid")
            .mockReturnValue(true);

        const createUserSpy = jest
            .spyOn(UserService, "createUser")
            .mockResolvedValue({ id: "any_id" });

        await UserCtrl.create(req, res);

        expect(isValidSpy).toHaveBeenCalledWith(mockUser.email);
        expect(createUserSpy).toHaveBeenCalledWith({ ...mockUser });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: "any_id" });
    });

    test("should return 400 when email is invalid", async () => {
        mockUser = {
            name: "any_name",
            email: "invalid_email",
            password: "any_password",
        };

        const req = {
            body: mockUser,
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const isValidSpy = jest
            .spyOn(EmailValidator, "isValid")
            .mockReturnValue(false);

        await UserCtrl.create(req, res);

        expect(isValidSpy).toHaveBeenCalledWith(mockUser.email);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith("Email inválido");
    });

    test("should return 400 when password is invalid", async () => {
        const req = {
            body: {
                name: "any_name",
                email: "any@email.com",
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

        await UserCtrl.create(req, res);

        expect(isValidSpy).toHaveBeenCalledWith(req.body.email);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith("Senha inválida");
    });

    test("should return 500 when server error", async () => {
        mockUser = {
            name: "any_name",
            email: "any@mail.com",
            password: "any_password",
        };

        const req = {
            body: mockUser,
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const isValidSpy = jest
            .spyOn(EmailValidator, "isValid")
            .mockReturnValue(true);

        const createUserSpy = jest
            .spyOn(UserService, "createUser")
            .mockRejectedValue("Server Error");

        await UserCtrl.create(req, res);

        expect(isValidSpy).toHaveBeenCalledWith(mockUser.email);
        expect(createUserSpy).toHaveBeenCalledWith({ ...mockUser });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith("Server Error");
    });

    test("should change password", async () => {
        const req = {
            userEmail: "any@mail.com",
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await UserCtrl.changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "ok" });
    });
});
