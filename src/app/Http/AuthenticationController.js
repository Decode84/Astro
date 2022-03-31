const User = require("../Models/User");
const bcrypt = require("bcrypt");
// On any request req, req.session.user is now available where the userSession can be accesed
//  by User = require("../Models/User"); and then User.findOne to fetch the user from the database

/**
 * Show the login page and check if the user is already logged in
 * @param {*} req
 * @param {*} res
 */
exports.login = (req, res) => {
  if (req.session.user) 
    res.redirect("dashboard");
  res.render("auth/login");
};

/**
 * Show the register page and check if the user is already logged in
 * @param {*} req
 * @param {*} res
 */
exports.register = (req, res) => {
  if (req.session.user) 
    res.redirect("dashboard");
  res.render("auth/register");
};

/**
 * Authenticate the user and redirect to the dashboard
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.authenticate = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send("Please fill all the fields");

  User
  .findOne({ email })
  .then((user) => {
    if (!user) return res.status(400).send("User does not exist");

    bcrypt
      .compare(password, user.password)
      .then((isMatch) => {
        if (isMatch) res.json(req.session.user);
        else return res.status(400).send("Incorrect password");
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
exports.store = (req, res) => {
  const { name, email, password, password_confirmation } = req.body;

  if (!name || !email || !password || !password_confirmation)
    return res.status(400).send("Please fill all the fields");

  if (password !== password_confirmation)
    return res.status(400).send("Passwords do not match");

  if (password.length < 6)
    return res.status(400).send("Password must be at least 6 characters");

  User.findOne({email}).then((user) => {
    if (user) return res.status(400).send("User already exists");

    const newUser = new User({
      name,
      email,
      password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
        .save()
        .then((user) => {
            req.session.user = user;
            res.json(user);
            // res.redirect("login");
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
  req.session.destroy();
  res.redirect("/login");
};
