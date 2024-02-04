require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const UserSchema = require("../../../src/schemas/User");

const UserService = require("../../../src/services/user-service");
const InvalidPasswordException = require("../../../src/utils/errors/InvalidPasswordException");

const userMock = {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
};

describe("Test integration between user service and database", () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URL);
        await UserSchema.create(userMock);
    });

    afterAll(async () => {
        await UserSchema.deleteMany({});
        await mongoose.connection.close();
    });

    test("Should create a new user", async () => {
        const createUser = await UserService.createUser({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        });

        expect(createUser).toHaveProperty("id");
    });

    test("Should throws an error if the password do not match", async () => {
        invalidPasswordUserMock = {
            email: userMock.email,
            password: faker.internet.password(),
        };
        try {
            await UserService.userExistsAndCheckPassword(
                invalidPasswordUserMock
            );
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidPasswordException);
        }
    });

    test("Should return true if the user exists and the password match", async () => {
        const userExists = await UserService.userExistsAndCheckPassword(
            userMock
        );
        expect(userExists).toBe(true);
    });

    test("Should return false if the user do not exists", async () => {
        const userExists = await UserService.userExistsAndCheckPassword({
            email: faker.internet.email(),
            password: faker.internet.password(),
        });
        expect(userExists).toBe(false);
    });
});
