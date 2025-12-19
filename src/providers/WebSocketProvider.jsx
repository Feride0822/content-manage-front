import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { STORAGE_KEYS } from "../constants/auth.constants";

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socketService, setSocketService] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "{}");
    const userId = user.id || "guest";

    const socket = io("http://localhost:3003", {
      query: { userId },
    });

    socketRef.current = socket;

    const service = {
      on: (event, cb) => {
        socket.on(event, cb);
        return () => socket.off(event, cb);
      },
      off: (event, cb) => socket.off(event, cb),
      emit: (event, data) => socket.emit(event, data),
      sendTyping: (postId, displayName) =>
        socket.emit("comment:typing", { postId, displayName }),
      sendStopTyping: (postId, displayName) =>
        socket.emit("comment:stop-typing", { postId, displayName }),
      joinPostRoom: (postId) => socket.emit("post:join", { postId }),
    };

    setSocketService(service);

    console.log("🟢 Connected to socket as user:", userId);

    socket.on("connect", () => console.log("Socket connected:", socket.id));
    socket.on("disconnect", (reason) =>
      console.log("Socket disconnected:", reason)
    );
    socket.on("connect_error", (err) =>
      console.error("Socket connect error:", err)
    );

    // Listen for notifications
    socket.on("notification", (data) => {
      console.log("🔔 Notification received:", data);
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const clearNotifications = () => setNotifications([]);

  return (
    <WebSocketContext.Provider
      value={{ socketService, notifications, clearNotifications }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
