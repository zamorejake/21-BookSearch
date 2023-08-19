const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  authMiddleware: function (req, res, next) {
    let token = req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      const tokenArray = token.split(" ");
      if (tokenArray[0] === "Bearer" && tokenArray[1]) {
        token = tokenArray[1];
      } else {
        return res.status(401).json({ message: "Invalid token format" });
      }
    }

    if (!token) {
      return res.status(401).json({ message: "You have no token!" });
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      next();
    } catch {
      console.log("Invalid token");
      return res.status(401).json({ message: "Invalid token!" });
    }

    next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
