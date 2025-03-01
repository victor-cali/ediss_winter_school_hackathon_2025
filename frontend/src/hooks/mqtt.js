import { useEffect, useState } from "react";
import mqtt from "mqtt";

const MQTT_BROKER = "ws://localhost:9001"; // Example WebSocket Broker
const TOPIC = "camera/#";

export const useMqtt = () => {
  const [message, setMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      setIsConnected(true);
      client.subscribe(TOPIC, (err) => {
        if (err) {
          console.error("Subscription error:", err);
        } else {
          console.log(`Subscribed to topic: ${TOPIC}`);
        }
      });
    });

    client.on("message", (topic, payload) => {
      console.log('Message received from ${topic}:, payload.toString()');
      setMessage(payload.toString());
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
    });

    client.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from MQTT broker");
    });

    return () => {
      client.end();
    };
  }, []);

  return { message, isConnected };
};