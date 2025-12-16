const API_BASE = "http://localhost:3000";

export async function uploadVideo(file) {
  const formData = new FormData();
  formData.append("video", file);

  const res = await fetch(`${API_BASE}/videos/upload`, {
    method: "POST",
    body: formData
  });

  return res.json();
}

export async function getTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  return res.json();
}

export async function downloadVideo(taskId) {
  window.open(`${API_BASE}/tasks/${taskId}/download`);
}

export async function deleteVideo(taskId) {
  await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE"
  });
}
