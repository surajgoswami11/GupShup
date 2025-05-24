const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./lib/db");
const authRoute = require("./routes/authRoute");
const messageRoute = require("./routes/messageRoute");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();

connectDB();

app.use(express.json());
app.use(cookieParser());

//
app.use("/api/auth", authRoute);
// app.use("api/auth", messageRoute);

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
});
