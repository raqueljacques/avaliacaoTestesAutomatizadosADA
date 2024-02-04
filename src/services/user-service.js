const UserSchema = require("../schemas/User");
const InvalidPasswordException = require("../utils/errors/InvalidPasswordException");

class UserService {
    static async createUser({ name, email, password }) {
        const { id } = await UserSchema.create({
            name,
            email,
            password,
        });

        return { id };
    }

    static async userExistsAndCheckPassword({ email, password }) {
        const user = await UserSchema.findOne({ email });

        if (!user) {
            return false;
        }

        if (password !== user.password) {
            throw new InvalidPasswordException("As senhas não batem");
        }

        return true;
    }
}

module.exports = UserService;
