const { User } = require('../models');
const { authMiddleware, signToken } = require('../utils/auth');

module.exports = {
  // get a single user by either their id or their username
  async getSingleUser({ user = null, params }, res) {
    try {
      const foundUser = await User.findOne({
        $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
      });

      if (!foundUser) {
        return res.status(400).json({ message: 'Cannot find a user with this id!' });
      }

      res.json(foundUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // create a user, sign a token, and send it back
  async createUser({ body }, res) {
    try {
      const user = await User.create(body);

      if (!user) {
        return res.status(400).json({ message: 'Something went wrong!' });
      }

      const token = signToken(user);
      res.json({ token, user });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // login a user, sign a token, and send it back
  async login({ body }, res) {
    try {
      const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
      if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        return res.status(400).json({ message: 'Incorrect password!' });
      }

      const token = signToken(user);
      res.json({ token, user });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // save a book to a user's `savedBooks` field
  async saveBook({ user, body }, res) {
    try {
      if (!user) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );

      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // remove a book from `savedBooks`
  async deleteBook({ user, params }, res) {
    try {
      if (!user) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Couldn't find user with this id!" });
      }

      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
};
