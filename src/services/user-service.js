const User = require("../schemas/User");
const InvalidPasswordException = require("../utils/erros/InvalidPasswordException");

class UserService {
    static async createUser({ name, email, password }) {
        const { id } = await User.create({
            name,
            email,
            password,
        });

        return { id };
    }

    static async userExistsAndCheckPassword({ email, password }) {
        const user = await User.findOne({ email });

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
