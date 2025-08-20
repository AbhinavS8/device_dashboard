import logo from './logo.svg';
import './App.css';
import { useEffect,useState } from 'react';

function App() {
    const [backendData, setBackendData] = useState(null);
  
useEffect(() => {
    fetch("http://localhost:5000/api/data")
      .then((res) => res.json())
      .then((data) => setBackendData(data));
  }, []);

  return (
    <div>
      <h1>React + Node Demo</h1>
      {backendData ? (
        <div>
          <p>{backendData.message}</p>
          <ul>
            {backendData.sensors.map((s) => (
              <li key={s.id}>
                {s.name}: {s.value}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}
export default App;
