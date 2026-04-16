const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
} else {
    console.log("MongoDB not configured, running without DB");
}

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(4000, '0.0.0.0', () => {
    console.log("Server running on port 4000");
});
