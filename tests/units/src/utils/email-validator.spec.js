const emailValidator = require("../../../../src/utils/email-validator");

describe("Email validator test", () => {
    test("should return false when email is empty", () => {
        expect(emailValidator.isValid("")).toBe(false);
    });

    test("should return true when email is valid", () => {
        expect(emailValidator.isValid("any@email.com.br")).toBe(true);
    });

    test("should return false when email is invalid", () => {
        expect(emailValidator.isValid("anyemail.com.br")).toBe(false);
    });

    test("should return false when email is null", () => {
        expect(emailValidator.isValid(null)).toBe(false);
    });

    test("should return false when email is undefined", () => {
        expect(emailValidator.isValid(undefined)).toBe(false);
    });

    test("should return false when email is a number", () => {
        expect(emailValidator.isValid(123)).toBe(false);
    });
});
