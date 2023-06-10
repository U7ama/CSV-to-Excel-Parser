const express = require("express");

const router = express.Router();

const xlsxFilePath = "./uploads/output.xlsx";

router.get("/", (req, res) => {
  res.download(xlsxFilePath, "output.xlsx", (error) => {
    if (error) {
      console.error("Failed to download file", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });
});

module.exports = router;
