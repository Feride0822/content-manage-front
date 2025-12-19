// services/socketService.js
import { io } from "socket.io-client";

class SocketService {
  socket = null;
  listeners = new Map();

  connect(userId) {
    if (this.socket?.connected) return;

    this.socket = io("http://localhost:3003", {
      transports: ["websocket"],
      auth: { userId },
    });

    this.socket.on("connect", () => {
      console.log("✅ socket connected");
    });

    [
      "like:created",
      "like:removed",
      "comment:created",
      "comment:deleted",
      "view:created",
    ].forEach((event) => {
      this.socket.on(event, (data) => this.emit(event, data));
    });
  }

  on(event, cb) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(cb);

    return () => {
      const arr = this.listeners.get(event);
      this.listeners.set(
        event,
        arr.filter((fn) => fn !== cb)
      );
    };
  }

  emit(event, data) {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }

  sendView(postId) {
    this.socket?.emit("post:view", { postId });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.listeners.clear();
  }
}

export default new SocketService();
