const express = require("express"),
  router = express.Router();
const fs = require("fs");
const path = require("path");

let arr = [];
try {
  let data = fs.readFileSync(path.resolve(__dirname, "users.json"));
  arr = JSON.parse(data);
} catch (error) {
  console.log("cant parse file");
}
router.post("/signup", (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    if (!username) throw new Error("Username is required");
    if (!password) throw new Error("Password is required");

    if (arr.find((v) => v.username == username)) {
      throw new Error("User Name already exits");
    }
    arr.push({ username, password });
    console.log(arr);
    fs.writeFileSync(
      path.resolve(__dirname, "users.json"),
      JSON.stringify(arr)
    );
    res.json({ success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
});
router.post("/login", (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    if (!username) throw new Error("Username is required");
    if (!password) throw new Error("Password is required");
    let user = arr.find(
      (v) => v.username == username && v.password == password
    );
    if (user) {
      res.json({ user, success: true });
      return;
    } else throw new Error("User not found");
  } catch (error) {
    res.json({ message: error.message, success: false, arr });
  }
});

module.exports = router;
