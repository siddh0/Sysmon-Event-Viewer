//Not in use //for web purposes


// const express = require("express");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
// const xmlJs = require("xml-js");
// const cors = require("cors");

// const app = express();
// const upload = multer({ dest: "uploads/" });

// app.use(express.json());
// app.use(cors()); // Enable CORS for all routes

// app.post("/upload", upload.single("file"), (req, res) => {
//   const filePath = req.file.path;

//   console.log("File uploaded:", req.file); // Log the uploaded file

//   // Read the XML file
//   fs.readFile(filePath, "utf-8", (err, data) => {
//     if (err) {
//       console.error("Error reading file:", err);
//       return res.status(500).json({ error: "Error reading file" });
//     }

//     // Parse XML to JavaScript object
//     let xmlObject;
//     try {
//       xmlObject = xmlJs.xml2js(data, { compact: true, spaces: 2 });
//     } catch (parseError) {
//       console.error("Error parsing XML:", parseError);
//       return res.status(500).json({ error: "Error parsing XML" });
//     }

//     // Convert the parsed XML object to JSON string
//     const jsonContent = JSON.stringify(xmlObject, null, 2);
//     var fs = require('fs');
//     fs.writeFile("uploads2/test.json", jsonContent, function(err) {
//         if (err) {
//             console.log(err);
//         }
//     });
//     // Log JSON content
    

//     // Send JSON content in response
//     res.json({ content: jsonContent });

//     // Clean up: delete the uploaded file after parsing
//     fs.unlink(filePath, (unlinkErr) => {
//       if (unlinkErr) {
//         console.error("Error deleting file:", unlinkErr);
//       }
//     });
//   });
// });


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
