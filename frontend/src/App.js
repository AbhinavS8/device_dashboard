import logo from './logo.svg';
import './App.css';
import { useEffect,useState } from 'react';
import SocketMessages from "./components/websocket";
function App() {
//     const [backendData, setBackendData] = useState(null);
  
// useEffect(() => {
//     fetch("http://localhost:5000/api/data")
//       .then((res) => res.json())
//       .then((data) => setBackendData(data));
//   }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#181818",
      color: "#f1f1f1",
      fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
      padding: 0,
      margin: 0,
      boxSizing: "border-box"
    }}>
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "32px 16px"
      }}>
        <h1 style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "2.5rem",
          marginBottom: 24,
          color: "#90caf9"
        }}>Device Dashboard</h1>
        <SocketMessages />
      </div>
    </div>
  );
}
export default App;
