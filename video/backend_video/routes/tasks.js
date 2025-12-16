const express = require("express");
const { tasks } = require("../tasksStore");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(tasks);
});

router.get("/:id/download", (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task || task.state !== "COMPLETED") {
    return res.status(400).send("Not ready");
  }
  res.download(task.outputPath);
});

router.delete("/:id", (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index !== -1) tasks.splice(index, 1);
  res.json({ success: true });
});

module.exports = router;


