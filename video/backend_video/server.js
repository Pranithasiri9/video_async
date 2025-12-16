const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./routes/uploads");
const tasksRoutes = require("./routes/tasks");

// 👇 IMPORTANT: start worker in same process
require("./worker");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/videos", uploadRoutes);
app.use("/tasks", tasksRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

