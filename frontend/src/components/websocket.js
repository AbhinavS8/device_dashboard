import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // adjust port if needed

export default function SocketMessages() {
  const [messages, setMessages] = useState([]);
  const [sensor, setSensor] = useState(null);

  useEffect(() => {

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    
    socket.on("sensorUpdate", (data) => {
      console.log("Got sensor data:", data); // should log { temperature: 43 }
      setSensor(data);
    });



    // cleanup when component unmounts
    return () => {
      socket.off("newMessage");
      socket.off("connect");
      socket.off("sensorUpdate");
    };
  }, []);

  return (
    <div>
    <ul>
      {messages.map((msg, idx) => (
        <li key={idx}>
          {msg.from}: {msg.text}
        </li>
      ))}
    </ul>
    <p>
  Sensor data:{" "}
  {sensor
    ? `temp: ${sensor.temperature}`
    : "Waiting for sensor data..."}
</p>


</div>
  );
}
