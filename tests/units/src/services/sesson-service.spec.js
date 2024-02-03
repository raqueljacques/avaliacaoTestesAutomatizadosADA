const SessionService = require("../../../../src/services/session-service");
const jwt = require("jsonwebtoken");

describe("Session service", () => {
    test("should generate a token", () => {
        const email = "any_email@gmail.com";

        jest.spyOn(jwt, "sign").mockReturnValue("any_token");

        const token = SessionService.generateToken({ email });
        expect(token).toBeDefined();
    });
});
