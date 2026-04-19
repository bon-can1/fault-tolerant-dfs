#  Distributed File System with Fault Tolerance

##  Overview

This project implements a Distributed File System (DFS) that ensures data availability, fault tolerance, and integrity across multiple storage nodes.

The system follows a Coordinator–Worker architecture:
- Coordinator manages metadata and node health
- Storage Nodes store file chunks
- Client uploads/downloads files

---

##  Architecture

Client → Coordinator (5000)
            |
    -------------------------
    |         |         |
  Node1     Node2     Node3
 (5001)    (5002)    (5003)

---

##  Features

- File chunking (1MB)
- Replication (2 copies)
- Heartbeat monitoring
- Automatic re-replication
- SHA-256 data integrity
- Status monitoring
- File deletion

---

##  Setup

Install dependencies:

pip install -r requirements.txt

---

##  Run

Terminal 1:
python coordinator.py

Terminal 2:
python storage_node.py node1

Terminal 3:
python storage_node.py node2

Terminal 4:
python storage_node.py node3

---

##  Usage

Upload:
python client.py upload test.txt

Download:
python client.py download test.txt output.txt

Status:
python client.py status

Delete:
python client.py delete test.txt

---

##  Fault Tolerance

- Data stored in multiple nodes
- Node failure handled automatically
- Re-replication restores lost data

---

##  Data Integrity

- SHA-256 hash verification
- Detects corrupted chunks

---

##  Limitations

- Single coordinator
- No load balancing
- Localhost only

---

##  Conclusion

This project demonstrates distributed storage with replication, fault tolerance, and integrity similar to systems like HDFS.
