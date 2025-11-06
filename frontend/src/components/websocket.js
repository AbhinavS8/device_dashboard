import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const socket = io("http://localhost:5000");

export default function SocketMessages() {
  const [messages, setMessages] = useState([]);
  const [sensors, setSensors] = useState({});
  const [topicData, setTopicData] = useState({});
  const [subscribedTopics, setSubscribedTopics] = useState([]);
  const [inputTopic, setInputTopic] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("sensorUpdate", (data) => {
      setSensors((prev) => ({
        ...prev,
        [data.topic]: data,
      }));
      // Fetch latest topic data from backend
      fetchTopicData(data.topic);
    });

    return () => {
      socket.off("newMessage");
      socket.off("connect");
      socket.off("sensorUpdate");
    };
  }, []);

  const fetchTopicData = async (topic) => {
    try {
      const res = await fetch(`http://localhost:5000/api/topic/${topic}`);
      const data = await res.json();
      setTopicData((prev) => ({ ...prev, [topic]: data }));
    } catch (err) {
      console.error("Failed to fetch topic data", err);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (inputTopic && !subscribedTopics.includes(inputTopic)) {
      socket.emit("subscribeTopic", inputTopic);
      setSubscribedTopics((prev) => [...prev, inputTopic]);
      fetchTopicData(inputTopic);
      setInputTopic("");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubscribe}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 32,
          background: "#23272a",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          alignItems: "center"
        }}
      >
        <input
          type="text"
          value={inputTopic}
          onChange={(e) => setInputTopic(e.target.value)}
          placeholder="Enter topic to subscribe"
          style={{
            flex: 1,
            minWidth: 180,
            padding: "10px 14px",
            borderRadius: 6,
            border: "none",
            background: "#181818",
            color: "#f1f1f1",
            fontSize: "1rem",
            outline: "none"
          }}
        />
        <button
          type="submit"
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "10px 18px",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          Subscribe
        </button>
      </form>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 32
      }}>
        {subscribedTopics.map((topic) => (
          <div
            key={topic}
            style={{
              background: "#23272a",
              borderRadius: 8,
              padding: 20,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              width: "100%",
              overflowX: "auto"
            }}
          >
            <h3 style={{
              color: "#90caf9",
              fontWeight: 600,
              fontSize: "1.3rem",
              marginBottom: 16
            }}>{topic}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={(topicData[topic] || []).map((entry) => ({
                  value: entry.data,
                  timestamp: new Date(entry.timestamp).toLocaleTimeString(),
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="timestamp" stroke="#f1f1f1" />
                <YAxis stroke="#f1f1f1" />
                <Tooltip
                  contentStyle={{ background: "#23272a", color: "#f1f1f1", border: "none" }}
                  labelStyle={{ color: "#90caf9" }}
                />
                <Legend wrapperStyle={{ color: "#f1f1f1" }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#90caf9"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
// ...existing code...
}
