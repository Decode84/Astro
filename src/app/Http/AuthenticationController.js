const User = require('../Models/User')
const bcrypt = require('bcrypt')
// On any request req, req.session.user is now available where the userSession can be accesed
//  by User = require("../Models/User"); and then User.findOne to fetch the user from the database

/**
 * Show the login page and check if the user is already logged in
 * @param {*} req
 * @param {*} res
 */
exports.login = (req, res) => {
    if(req.session.user) {
        res.redirect("/dashboard");
    } else {
        res.render("auth/login");
    }
};



/**
 * Show the register page and check if the user is already logged in
 * @param {*} req
 * @param {*} res
 */
exports.register = (req, res) => {
    if(req.session.user) {
        res.redirect("/dashboard");
    } else {
        res.render("auth/register");
    }
};


/**
 * Show the forgot password page
 * @param {*} req
 * @param {*} res
 */
exports.forgot = (req, res) => {
    if(req.session.user) {
        res.redirect("/dashboard");
    } else {
        res.render("auth/forgot");
    }
};


/**
 * Authenticate the user and redirect to the dashboard
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.authenticate = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) return res.status(400).send("Please fill all the fields");
  
    User
    .findOne({ username })
    .then((user) => {
      if (!user) return res.status(400).send("User does not exist");
  
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            req.session.user = user;
            res.redirect("/project");
          } else { 
          return res.status(400).send("Incorrect password");
          }
        })
        .catch((err) => console.log(err));
    });
  };

/**
 * Create a new user and redirect to the dashboard
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.signup = (req, res) => {
    const { name, username, email, password, passwordConfirmation } = req.body;
  
    if (!name || !username || !email || !password || !passwordConfirmation)
        return res.status(400).send("Please fill all the fields");
  
    if (password !== passwordConfirmation)
      return res.status(400).send("Passwords do not match");
  
    if (password.length < 8)
      return res.status(400).send("Password must be at least 6 characters");
  
    User.findOne({username}).then((user) => {
      if (user) return res.status(400).send("User already exists");
  
      const newUser = new User({
        name,
        username,
        email,
        password,
      });
  
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) console.log(err);
          newUser.password = hash;
          newUser
          .save()
          .then((user) => {
              // req.session.user = user;
              // res.json(user);
              res.redirect("login");
          })
          .catch((err) => console.log(err));
        });
      });
    });
  };

/**
 * Logout the user and redirect to the login page
 * @param {*} req
 * @param {*} res
 */
exports.logout = (req, res) => {
    if(req.session) {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    } else {
        res.redirect("/login");
    }
};
