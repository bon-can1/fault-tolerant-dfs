# 📁 Distributed File System (DFS) with Fault Tolerance

A robust, fault-tolerant Distributed File System (DFS) built in Python, featuring a beautiful real-time Web Dashboard, chunk-based file storage, automated replication, and data integrity verification.

![DFS Banner](https://img.shields.io/badge/Status-Active-brightgreen) ![Python](https://img.shields.io/badge/Python-3.9+-blue) ![Flask](https://img.shields.io/badge/Flask-Web_UI-purple)

---

## ✨ Features

- **Chunking & Replication**: Files are split into 1MB chunks and replicated across 3 different nodes to ensure high availability.
- **Fault Tolerance**: Automatic heartbeat monitoring. If a node goes offline, the system automatically re-replicates lost chunks to healthy nodes.
- **Data Integrity**: Uses SHA-256 hashing to verify chunks upon download, detecting and ignoring corrupted data.
- **Premium Web Interface**: A beautifully designed, glassmorphic dashboard to monitor cluster health, view files, and easily upload/download data.
- **CLI Client**: Full-featured command-line interface for scripting and manual control.

---

## 🏗 Architecture

The system utilizes a **Coordinator-Worker Architecture**:
- **Coordinator (Port 5150)**: Manages file metadata, allocates chunks, handles the Web UI, and monitors storage node health.
- **Storage Nodes (Ports 5001, 5002, 5003)**: Dumb workers that store chunk data locally and periodically send heartbeats.
- **Client**: Interacts with the Coordinator to locate/allocate data and streams chunks to/from Storage Nodes.

```text
       [ Web Dashboard & CLI Client ]
                    |
          [ Coordinator (5150) ]
            /       |       \
    [ Node 1 ]  [ Node 2 ]  [ Node 3 ]
      (5001)      (5002)      (5003)
```

---

## 🚀 Setup & Installation

**Prerequisites:**
- Python 3.9 or higher

1. **Install dependencies:**
   ```bash
   pip install flask requests
   ```

2. **Start the Cluster:**
   You must start the Coordinator and all Storage Nodes in separate terminals to simulate a distributed environment.

   **Terminal 1 (Coordinator):**
   ```bash
   python coordinator.py
   ```

   **Terminal 2 (Storage Node 1):**
   ```bash
   python storage_node.py node1
   ```

   **Terminal 3 (Storage Node 2):**
   ```bash
   python storage_node.py node2
   ```

   **Terminal 4 (Storage Node 3):**
   ```bash
   python storage_node.py node3
   ```

---

## 💻 Web Dashboard Usage

Once all nodes are running, open your web browser and navigate to:
**http://localhost:5150**

From the dashboard, you can:
- **Monitor Health**: Watch nodes go online/offline in real-time.
- **Manage Files**: Upload files directly from your browser and download existing ones.
- **Track Distribution**: See exactly how many chunks your files have been split into.

> **Note:** Uploading via the web dashboard will fail if you haven't started any storage nodes!

---

## ⌨️ CLI Usage

You can also interact with the DFS via the provided command-line client.

**Upload a file:**
```bash
python client.py upload test.txt
```

**Download a file:**
```bash
python client.py download test.txt output.txt
```

**Check cluster status:**
```bash
python client.py status
```

**Delete a file:**
```bash
python client.py delete test.txt
```

---

## 🛠 Testing Fault Tolerance

1. Start the coordinator and 3 storage nodes.
2. Upload a file via the CLI or Web UI.
3. Terminate one of the storage node processes (e.g., `CTRL+C` on Terminal 2).
4. Watch the coordinator terminal. After the timeout period (15s), it will detect the node failure and automatically begin re-replicating the lost chunks to the remaining healthy nodes.
5. You can still download the file without data loss!

---

## 📝 Limitations

- Single point of failure (Coordinator is not replicated).
- Hardcoded localhost IP bindings for simulation purposes.
- No dynamic node registration (Nodes must be predefined in `config.py`).