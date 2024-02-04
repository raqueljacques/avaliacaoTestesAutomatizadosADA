const UserService = require("../../../../src/services/user-service");
const User = require("../../../../src/schemas/User");
const InvalidPasswordException = require("../../../../src/utils/erros/InvalidPasswordException");

describe("User service test", () => {
    test("should create a user", async () => {
        const UserSpy = jest.spyOn(User, "create").mockResolvedValue({
            id: "any_id",
        });

        const user = {
            name: "any_name",
            email: "any_email@mail.com",
            password: "any_password",
        };

        const { id } = await UserService.createUser(user);

        expect(id).toBeDefined();
        expect(UserSpy).toHaveBeenCalledWith({
            name: "any_name",
            email: "any_email@mail.com",
            password: "any_password",
        });
    });

    test("should check if user exists and password is correct", async () => {
        const UserSpy = jest.spyOn(User, "findOne").mockResolvedValue({
            email: "any_email@mail.com",
            password: "any_password",
        });

        const user = {
            email: "any_email@mail.com",
            password: "any_password",
        };

        const userExists = await UserService.userExistsAndCheckPassword(user);

        expect(userExists).toBe(true);
        expect(UserSpy).toHaveBeenCalledWith({
            email: "any_email@mail.com",
        });
    });

    test("should return false when user does not exist", async () => {
        const UserSpy = jest.spyOn(User, "findOne").mockResolvedValue(null);

        const user = {
            email: "invalid_email",
            password: "any_password",
        };

        const userExists = await UserService.userExistsAndCheckPassword(user);

        expect(userExists).toBe(false);
        expect(UserSpy).toHaveBeenCalledWith({
            email: "invalid_email",
        });
    });

    test("should return false when password is incorrect", async () => {
        jest.spyOn(User, "findOne").mockResolvedValue({
            email: "any_email@mail.com",
            password: "password",
        });

        const user = {
            email: "any_email@mail.com",
            password: "invalid_password",
        };

        await expect(
            UserService.userExistsAndCheckPassword(user)
        ).rejects.toThrow(InvalidPasswordException);
    });
});
