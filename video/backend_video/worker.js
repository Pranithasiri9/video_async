const { tasks } = require("./tasksStore");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const RESOLUTION_MAP = {
  "480": "854:480",
  "720": "1280:720",
  "1080": "1920:1080"
};

function processTask(task) {
  task.state = "PROCESSING";

  const outputDir = path.join(__dirname, "outputs");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const outputPath = path.join(
    outputDir,
    `${task.resolution}p-${task.filename}`
  );

  const scale = RESOLUTION_MAP[task.resolution];

  const command = `ffmpeg -i "${task.inputPath}" -vf scale=${scale} -preset fast -crf 28 "${outputPath}"`;

  exec(command, err => {
    if (err) {
      task.state = "FAILED";
      return;
    }

    task.outputPath = outputPath;
    task.state = "COMPLETED";
  });
}

setInterval(() => {
  const task = tasks.find(t => t.state === "QUEUED");
  if (task) processTask(task);
}, 2000);



