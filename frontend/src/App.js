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
    // <div>
    //   <h1>React + Node Demo</h1>
    //   {backendData ? ( //load backendData if available, else show loading
    //     <div>
    //       <p>{backendData.message}</p>
    //       <ul>
    //         {backendData.sensors.map((s) => (
    //           <li key={s.id}>
    //             {s.name}: {s.value}
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   ) : (
    //     <p>Loading data...</p>
    //   )}
      <div>
        <p>enter topic:</p>
        {/* <form in></form> */}
        <h1>Live Messages</h1>
        <SocketMessages />
      </div>
    // </div>
  );
}
export default App;
