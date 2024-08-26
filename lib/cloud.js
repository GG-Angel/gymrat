const express = require("express");

// init cloud connection and middleware
const cloud = express();

cloud.listen(3000, () => {
  console.log("Cloud Started");
});

// routes
cloud.get("/test", (req, res) => {
  res.json({ msg: "Welcome to API" });
});
