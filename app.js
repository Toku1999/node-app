const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("App is running 🚀");
});

app.listen(4000, '0.0.0.0', () => {
    console.log("Server running on port 4000");
});
