const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { tasks } = require("../tasksStore");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 200 * 1024 * 1024 }
});

router.post("/upload", upload.single("video"), (req, res) => {
  const resolution = req.body.resolution || "720";

  const task = {
    id: uuidv4(),
    filename: req.file.originalname,
    inputPath: req.file.path,
    outputPath: null,
    resolution,
    state: "QUEUED"
  };

  tasks.push(task);
  res.json(task);
});

module.exports = router;



