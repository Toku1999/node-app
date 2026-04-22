const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("EKS Fargate Working ✅");
});

// START SERVER FIRST (IMPORTANT)
app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});

// THEN connect Mongo (optional)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
