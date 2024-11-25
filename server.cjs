const express = require("express");
const multer = require("multer");
const path = require("path");
const qr = require("qrcode");

const app = express();
const PORT = 8080;

const cameraRoute = require('./routes/camera.cjs')

// Set up storage for uploaded selfies
const storage = multer.diskStorage({
  destination: "selfies/",
  filename: (req, file, cb) => {
    const filename = `selfie-${Date.now()}.jpg`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

app.use("/selfies", express.static(path.join(__dirname, "selfies"))); // Serve static files

// Route to take/upload selfie
app.post("/upload", upload.single("selfie"), (req, res) => {
  const fileUrl = `http://localhost:8080/${req.file.filename}`; // Use hotspot's IP address
  qr.toDataURL(fileUrl, (err, qrCode) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error generating QR code.");
    }
    res.json({ qrCode, fileUrl });
  });
});

app.set("view engine", "ejs"); // Set EJS as the template engine
app.set("views", path.join(__dirname, "views")); // Views directory


app.use('/camera', cameraRoute)

app.get("/download/:filename", (req, res) => {
   
    const filename = req.params.filename;
    const selfieUrl = `http://localhost:8080/selfies/${filename}`;
    console.log(filename)
    // Render a page with the selfie and a download link
    res.render("downloadpicture", { selfieUrl, filename });
  });

// Root route
app.get("/", (req, res) => {
  res.send("Node.js server is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on 8080`);
});
