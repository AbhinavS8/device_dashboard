# device_dashboard
A JavaScript dashboard that collects, visualizes, and stores data from IoT devices in real-time. Includes real-time charts, device list, and historical data view.

## Features
- Real-time charting of device telemetry (WebSocket / MQTT over WebSocket)
- Device list and detail view
- Export CSV for selected time ranges
- Responsive UI
- Simple backend API for ingestion and retrieval (Node/Express)

## Tech stack
- Frontend: React + Chart.js
- Backend: Node.js + Express
- Communication: MQTT, WebSocket

## Quick start
1. Clone
   ```
   git clone https://github.com/AbhinavS8/device_dashboard.git
   cd device_dashboard
   ```
2. Install
   ```
   npm install
   ```
3. Set environment (copy `.env.example` to `.env` and update values)
4. Start
   - For a single repo:
     ```
     npm run dev
     ```
   - If there is a separate server:
     ```
     cd server
     npm install
     npm run dev
     ```
5. Open http://localhost:3000

## Screenshots
