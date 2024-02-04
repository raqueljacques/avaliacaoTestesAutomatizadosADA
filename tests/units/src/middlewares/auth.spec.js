const jwt = require("jsonwebtoken");
const authMiddleware = require("../../../../src/middlewares/auth");

jest.mock("jsonwebtoken");

describe("Auth Middleware test", () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };
        next = jest.fn();
        process.env.SECRET_KEY = "anySecretKey";
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 401 if token is not provided", () => {
        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Token is not provided",
        });
    });

    test("should call next if token is valid", async () => {
        req.headers.authorization = "validToken";
        jwt.verify.mockResolvedValue({
            email: "test@example.com",
        });

        await authMiddleware(req, res, next);

        expect(req).toHaveProperty("userEmail", "test@example.com");
        expect(next).toHaveBeenCalled();
    });

    test("should return 401 if token is invalid", async () => {
        req.headers.authorization = "invalidToken";
        jwt.verify.mockRejectedValue(new Error("Invalid token"));

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid token",
        });
    });
});
