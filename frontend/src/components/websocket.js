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
      <form onSubmit={handleSubscribe} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={inputTopic}
          onChange={(e) => setInputTopic(e.target.value)}
          placeholder="Enter topic to subscribe"
        />
        <button type="submit">Subscribe</button>
      </form>

      {subscribedTopics.map((topic) => (
        <div key={topic} style={{ marginBottom: 40 }}>
          <h3>{topic}</h3>
          <ResponsiveContainer width="100%" height={300}>
  <LineChart
    data={(topicData[topic] || []).map((entry) => ({
      value: entry.data,
      timestamp: new Date(entry.timestamp).toLocaleTimeString(),
    }))}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="timestamp" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line
      type="monotone"
      dataKey="value"
      stroke="#8884d8"
      dot={false}
    />
  </LineChart>
</ResponsiveContainer>

        </div>
      ))}
    </div>
  );
// ...existing code...
}
