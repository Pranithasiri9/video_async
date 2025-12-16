const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const pool = require("../db");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("video"), async (req, res) => {
  const videoId = uuidv4();

  await pool.query(
    "INSERT INTO videos (id, original_filename, storage_path) VALUES ($1,$2,$3)",
    [videoId, req.file.originalname, req.file.path]
  );

  res.json({ videoId });
});

router.post("/:videoId/tasks", async (req, res) => {
  const { variants } = req.body;

  for (const v of variants) {
    await pool.query(
      `INSERT INTO tasks (id, video_id, output_format, resolution, state)
       VALUES ($1,$2,$3,$4,'QUEUED')`,
      [uuidv4(), req.params.videoId, v.format, v.profile]
    );
  }

  res.json({ message: "Tasks created" });
});

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM videos");
  res.json(result.rows);
});

router.get("/:id/tasks", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE video_id=$1",
    [req.params.id]
  );
  res.json(result.rows);
});

module.exports = router;
