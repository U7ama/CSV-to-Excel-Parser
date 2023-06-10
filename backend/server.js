const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");
const verifyToken = require("./middleware/auth");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(verifyToken);
app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/download", downloadRoutes);

app.listen(3000, () => console.log("Server started on port 3000"));
