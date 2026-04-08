const express = require("express");
const app = express();

const PORT = 4000;

app.get("/", (req, res) => {
  res.send("CI/CD pipeline webhook trigger is successfull, Great tokesh 🚀");
});

app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Tokesh" },
    { id: 2, role: "DevOps Engineer" }
  ]);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
