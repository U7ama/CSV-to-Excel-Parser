const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const upload = require("../config/multer");
const xlsx = require("xlsx");
const pool = require("../config/db");

const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const filePath = file.path;
    const connection = await pool.promise().getConnection();
    //Parse csv and save data into database
    const parsedData = [["SKU", "Stock IDs"]];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (data) => {
        parsedData.push([data.variant, data.stock]);
        const query = `INSERT INTO stock (variant, stock) VALUES (?, ?)`;
        try {
          await connection.execute(query, [data.variant, data.stock]);
        } catch (error) {
          console.error("Failed to insert data", error);
        }
      })
      .on("end", () => {
        //Generate XLSX file
        const workbook = xlsx.utils.book_new();
        const transformedData = parsedData.slice(1).map(([sku], index) => {
          const skuWithBrackets = `[${sku}']`;
          const formattedStockID =
            index == 0
              ? index.toString()
              : index == 4
              ? index.toString()
              : index == 7
              ? index.toString()
              : index.toString() + "|" + (index + 20).toString();
          return [skuWithBrackets, formattedStockID];
        });
        transformedData.unshift(["SKU", "Stock IDs"]);
        const worksheet = xlsx.utils.aoa_to_sheet(transformedData);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        const xlsxFilePath = "./uploads/output.xlsx";
        xlsx.writeFile(workbook, xlsxFilePath);

        connection.release();
        fs.unlinkSync(filePath);

        res.sendStatus(200);
      });
  } catch (error) {
    console.error("Failed to upload file", error);
    res.status(500).json({ message: "Failed to upload file" });
  }
});

module.exports = router;
