const { User, Book } = require("../models");

const { AuthenticationError } = require("apollo-server-express");
const resolvers = {
  Query: {
    me: async (_, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate(
          "savedBooks"
        );
        return user;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        throw new AuthenticationError("Incorrect password");
      }

      const token = jwt.sign({ _id: user._id }, "your-secret-key", {
        expiresIn: "1h",
      });

      return { token, user };
    },
    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: bookId } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  User: {
    savedBooks: async (parent) => {
      if (parent.savedBooks && parent.savedBooks.length > 0) {
        const savedBooks = await Book.find({ _id: { $in: parent.savedBooks } });
        return savedBooks;
      }
      return [];
    },
  },
};

module.exports = resolvers;
