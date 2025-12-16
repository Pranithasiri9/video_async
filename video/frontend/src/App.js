import { useEffect, useState } from "react";
import { uploadVideo, getTasks, downloadVideo, deleteVideo } from "./api";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [resolution, setResolution] = useState("720");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getTasks();
      setTasks(data);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    await uploadVideo(file, resolution);
    setFile(null);
  };

  return (
    <div className="container">
      {/* App Title */}
      <h1 className="title">Video Forge</h1>

      <input
        type="file"
        accept=".mp4,.mov,.webm"
        onChange={e => setFile(e.target.files[0])}
      />

      <select value={resolution} onChange={e => setResolution(e.target.value)}>
        <option value="480">480p</option>
        <option value="720">720p</option>
        <option value="1080">1080p</option>
      </select>

      <button onClick={handleUpload}>Upload</button>

      <h3>Tasks</h3>

      {tasks.map(task => (
        <div key={task.id} className="task-row">
          <span>
            {task.filename} ({task.resolution}p)
          </span>

          <span className={`state ${task.state}`}>{task.state}</span>

          {task.state === "COMPLETED" && (
            <>
              <button onClick={() => downloadVideo(task.id)}>Download</button>
              <button onClick={() => deleteVideo(task.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;



