const express = require('express');
const router = express.Router();
const path = require("path");
const qr = require("qrcode");

const NodeWebcam = require("node-webcam");


const webcam = NodeWebcam.create({
  width: 1280,
  height: 720,
  quality: 100,
  output: "jpeg",
  callbackReturn: "location",
  verbose: false,
});



router.get("/", (req, res) => {
  const filename = `selfies/selfie-${Date.now()}.jpg`;
  NodeWebcam.capture(filename, {}, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error capturing photo.");
    }
    const fileUrl = `https://jqkccp38-8080.brs.devtunnels.ms/download/${path.basename(data)}`;
    qr.toDataURL(fileUrl, (err, qrCode) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error generating QR code.");
      }
      //res.json({ qrCode, fileUrl });
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>QR Code</title>
          <style>
          body{
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center
          }
          img{
          height: 500px;
          width: 500px;
          }
          </style>
        </head>
        <body>

          <img src="${qrCode}" alt="QR Code" />
          
        </body>
        </html>
      `);
    });
  });
});

module.exports = router
