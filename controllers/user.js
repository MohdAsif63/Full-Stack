const User = require("../models/user.js");


module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};


module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({
        email,
        username,
      });
      const registerUser = await User.register(newUser, password);
      req.login(registerUser, (err) => {
        if (err) {
          return next();
        }
        req.flash("success", "Welcome to DreamLust!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };


  module.exports.renderLoginForm =  (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to DreamLusst!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };


  module.exports.logOut =  (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next();
    }
    req.flash("success", "You are Logged out now!");
    res.redirect("/listings");
  });
};
