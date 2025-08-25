import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // adjust port if needed

export default function SocketMessages() {
  const [messages, setMessages] = useState([]);
  const [sensors, setSensors] = useState({}); //use list instead of one value

  useEffect(() => {

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    
    // socket.on("sensorUpdate", (data) => {
    //   console.log("Got sensor data:", data); // should log { temperature: 43 }
    //   setSensor(data);
    // });

    socket.on("sensorUpdate", (data) => {
      setSensors((prev) => ({
        ...prev,
        [data.topic]: data, // store each topic’s latest data
      }));
    });


    // cleanup when component unmounts
    return () => {
      socket.off("newMessage");
      socket.off("connect");
      socket.off("sensorUpdate");
    };
  }, []);

  return (
//     <div>
//     <ul>
//       {messages.map((msg, idx) => (
//         <li key={idx}>
//           {msg.from}: {msg.text}
//         </li>
//       ))}
//     </ul>
//     <p>
//   Sensor data:{" "}
//   {sensor
//     ? `temp: ${sensor.temperature}`
//     : "Waiting for sensor data..."}
// </p>
// </div>
<div><ul>
  {Object.entries(sensors).map(([topic, data]) => (
    <li key={topic}>
      <strong>{topic}</strong>: {JSON.stringify(data)}
    </li>
  ))}
</ul>

</div>
);
}
