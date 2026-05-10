# Offline UPI Over Mesh Network (Simulation Project)

## Overview
This project is a backend simulation of an **offline-first UPI-like payment system over a mesh network**.  
It demonstrates how digital payments can be securely transmitted in unstable or disconnected environments and later synchronized when connectivity is restored.

The system focuses on **security, idempotency, and distributed reliability**, similar to real-world payment gateways.

---

## Core Idea
To simulate how a payment travels in a **decentralized mesh network**, gets duplicated across nodes, and is finally processed safely on a backend system with strong safeguards against tampering and replay attacks.

---

## Key Features Implemented

### 1. Hybrid Encryption (RSA + AES-GCM)
- End-to-end encryption of payment packets
- Only server can decrypt using private key
- Ensures confidentiality and tamper detection

---

### 2. Mesh Network Simulation
- Payment packets travel through multiple nodes
- Each node may duplicate packets (realistic network behavior)
- Offline-first storage at intermediate nodes

---

### 3. Packet Store (Offline Buffer)
- Stores packets when "offline"
- Flushes when "internet is available"
- Simulates real-world delayed sync systems

---

### 4. Replay Protection (Nonce System)
- Each transaction has a unique nonce
- MongoDB-backed persistent nonce store
- Prevents duplicate transaction processing

---

### 5. Packet Expiry (TTL Logic)
- Rejects stale packets older than a time window
- Ensures freshness of transactions

---

### 6. Idempotency Layer
- Prevents duplicate processing of same transaction
- Handles mesh-induced duplicates safely

---

### 7. Ledger System
- Stores final processed transactions
- Acts as simplified payment history database

---

### 8. Wallet Simulation
- Deducts and credits balances between users
- Mimics real payment settlement logic

---

## System Flow

1. Payment is created on sender side  
2. Packet is encrypted using public key  
3. Packet travels through mesh nodes  
4. Nodes store duplicates (offline behavior simulation)  
5. When connectivity returns:
   - Packets are flushed to backend  
6. Backend:
   - Decrypts packet  
   - Validates expiry  
   - Checks nonce (replay protection)  
   - Processes payment  
   - Writes to ledger  
7. Duplicate packets are safely rejected  

---

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Crypto (RSA + AES-GCM)
- File System (simulation storage)

---

## Key Learning Outcomes
- Distributed systems behavior (duplication, latency, consistency)
- Cryptographic security in real systems
- Idempotency design in payment systems
- Mesh network simulation concepts
- Backend architecture for financial systems

---

## Project Status
Completed (v1 simulation)

Future improvements:
- Real Bluetooth mesh integration
- Proper distributed queue system
- Frontend dashboard for transaction visualization
- Real-time node graph visualization

---

## Author
Built as a learning project exploring secure offline payment systems and distributed architecture concepts.
