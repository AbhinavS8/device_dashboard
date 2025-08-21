import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // adjust port if needed

export default function SocketMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // cleanup when component unmounts
    return () => {
      socket.off("newMessage");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <ul>
      {messages.map((msg, idx) => (
        <li key={idx}>
          {msg.from}: {msg.text}
        </li>
      ))}
    </ul>
  );
}
