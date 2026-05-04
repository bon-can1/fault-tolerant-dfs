const totalNodesEl = document.getElementById("totalNodes");
const aliveNodesEl = document.getElementById("aliveNodes");
const totalFilesEl = document.getElementById("totalFiles");
const totalChunksEl = document.getElementById("totalChunks");
const updatedAtEl = document.getElementById("updatedAt");
const nodesListEl = document.getElementById("nodesList");
const filesListEl = document.getElementById("filesList");
const refreshBtn = document.getElementById("refreshBtn");
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const uploadMessage = document.getElementById("uploadMessage");

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}

function renderEmptyState(container, text) {
  container.innerHTML = `<div class="list-item"><span>${text}</span></div>`;
}

async function handleUpload(event) {
  event.preventDefault();
  const file = fileInput.files[0];
  if (!file) {
    uploadMessage.textContent = "Choose a file first.";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const aliveNodesCount = parseInt(aliveNodesEl.textContent) || 0;
  if (aliveNodesCount === 0) {
    uploadMessage.textContent = "Upload failed: No active storage nodes. Please start the nodes first.";
    uploadMessage.style.color = "var(--bad)";
    return;
  }

  uploadMessage.textContent = "Uploading...";
  uploadMessage.style.color = "var(--muted)";

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }
    uploadMessage.textContent = `Uploaded ${data.filename} (${data.chunks} chunk(s)).`;
    fileInput.value = "";
    await fetchStatus();
  } catch (error) {
    uploadMessage.textContent = `Upload failed: ${error.message}`;
  }
}

async function fetchStatus() {
  try {
    const response = await fetch("/status");
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const data = await response.json();
    const nodes = data.nodes || {};
    const files = data.files || {};
    const nodeEntries = Object.entries(nodes);
    const fileEntries = Object.entries(files);
    const aliveCount = nodeEntries.filter(([, info]) => info.alive).length;
    const totalChunks = fileEntries.reduce((sum, [, chunks]) => sum + chunks, 0);

    totalNodesEl.textContent = nodeEntries.length;
    aliveNodesEl.textContent = aliveCount;
    totalFilesEl.textContent = fileEntries.length;
    totalChunksEl.textContent = totalChunks;
    updatedAtEl.textContent = `Last updated: ${formatTime()}`;

    if (!nodeEntries.length) {
      renderEmptyState(nodesListEl, "No node data available.");
    } else {
      nodesListEl.innerHTML = nodeEntries
        .map(([id, info]) => {
          const statusClass = info.alive ? "alive" : "down";
          const statusText = info.alive ? "ONLINE" : "OFFLINE";
          return `
            <div class="list-item">
              <div>
                <strong>${id}</strong>
                <div class="muted">${info.host}:${info.port}</div>
              </div>
              <span class="status-pill ${statusClass}">${statusText}</span>
            </div>
          `;
        })
        .join("");
    }

    if (!fileEntries.length) {
      renderEmptyState(filesListEl, "No files uploaded yet.");
    } else {
      filesListEl.innerHTML = fileEntries
        .map(([filename, chunks]) => {
          return `
            <div class="list-item">
              <div>
                <strong>${filename}</strong>
                <div class="muted">${chunks} chunk(s)</div>
              </div>
              <a class="btn btn-secondary" href="/download/${encodeURIComponent(filename)}">Download</a>
            </div>
          `;
        })
        .join("");
    }
  } catch (error) {
    updatedAtEl.textContent = "Could not load status. Try again.";
    renderEmptyState(nodesListEl, "Failed to fetch node information.");
    renderEmptyState(filesListEl, "Failed to fetch file information.");
    console.error(error);
  }
}

refreshBtn.addEventListener("click", fetchStatus);
uploadForm.addEventListener("submit", handleUpload);
fetchStatus();
setInterval(fetchStatus, 5000);
