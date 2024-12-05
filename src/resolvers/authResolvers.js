const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET_KEY = process.env.SECRET_KEY;

module.exports = {
  Mutation: {
    register: async (_, { username, password, role }) => {
      console.log("Register mutation called");
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, role });
      await user.save();
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
      return { username: user.username, role: user.role, token };
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
      }
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
      return { username: user.username, role: user.role, token };
    },
  },
};
