const { User, Book } = require("../models");
const bcrypt = require("bcrypt");
const { AuthenticationError } = require("apollo-server-express");
const resolvers = {
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

      const token = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        "mysecretsshhhhh",
        {
          expiresIn: "7200000",
        }
      );
      return { token, user: user.toObject() };
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
      throw new AuthenticationError("Not logged in!!!");
    },
  
  saveBook: async (_, { input }, context) => {
    console.log("46",input)
    console.log("47", context)
    if (context.user._id) {
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: input } },
        { new: true }
      ).populate("savedBooks");
      console.log("b4",updatedUser)
      return updatedUser;
    }
    console.log("after",updatedUser)
    throw new AuthenticationError("Not logged in!!!");
  },
},
  Query: {
    users: async (_, args, context) => {
      
      if (context.user) {
        const user = await User.findById(context.user._id).populate(
          { path: "savedBooks" }
        );
        return user;
      }
      throw new AuthenticationError("Not logged in???resolvers");
    },
  },
  User: {
    savedBooks: async (parent) => {
      console.log(parent)
      if (parent.savedBooks && parent.savedBooks.length > 0) {
        const userWithSavedBooks = await User.findById(parent._id).populate('savedBooks');
        return userWithSavedBooks.savedBooks;
      }
      return [];
    },
  },
};

module.exports = resolvers;
