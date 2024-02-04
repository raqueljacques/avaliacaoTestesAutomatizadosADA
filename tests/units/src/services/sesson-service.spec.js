const SessionService = require("../../../../src/services/session-service");
const jwt = require("jsonwebtoken");

describe("Session service test", () => {
    test("should generate a token", () => {
        const email = "any_email@mail.com";

        jest.spyOn(jwt, "sign").mockReturnValue("any_token");

        const token = SessionService.generateToken({ email });
        expect(token).toBeDefined();
    });
});
