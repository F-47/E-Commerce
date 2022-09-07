const userRouter = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
userRouter.get("/", (req, res) => {
  res.redirect("/home");
});
userRouter.get("/home", (req, res) => {
  res.render("HomePage", { title: "Home" });
});
userRouter.post("/home", async (req, res, next) => {
  let { name, email, password, repassword } = req.body;
  let errors = [];
  if (!name || !email || !password || !repassword) {
    errors.push({ msg: "Please enter all fields" });
  }
  if (password != repassword) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.status(422).json({ errors });
    return;
  }
  let newUser;
  try {
    newUser = new User({
      email,
      password,
      name,
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save((err) => {
          if (err) {
            res.send({ err });
            return;
          }
          res.redirect("https://facebook.com");
        });
      });
    });
  } catch (err) {
    res.send({ err });
    return;
  }
  if (!newUser) {
    res.status(500);
    return;
  }
});
userRouter.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
// });

module.exports = userRouter;
