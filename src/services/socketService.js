import { io } from "socket.io-client";

class SocketService {
  socket = null;
  listeners = new Map();

  connect(userId) {
    if (this.socket?.connected) return;

    this.socket = io("http://localhost:3003", {
      transports: ["websocket"],
      auth: { userId },
      query: { userId }, // Also pass in query for backend compatibility
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected with ID:", this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    // Listen to all socket events and forward to internal listeners
    [
      "post:created",
      "post:updated",
      "post:deleted",
      "like:created",
      "like:removed",
      "comment:created",
      "comment:updated",
      "comment:deleted",
      "comment:typing",
      "comment:stop-typing",
      "view:created",
      "follower:created", // ← Follow event (note: backend uses 'follower:created')
      "follow:removed", // ← Unfollow event
      "notification", // ← General notifications
    ].forEach((event) => {
      this.socket.on(event, (data) => {
        console.log(`🔔 Socket event received: ${event}`, data);
        this.emit(event, data);
      });
    });

    // DEBUGGING: Listen to ALL events to catch any we might be missing
    this.socket.onAny((eventName, ...args) => {
      console.log(`🔍 ANY Socket event: ${eventName}`, args);
    });
  }

  on(event, cb) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(cb);

    // Return unsubscribe function
    return () => {
      const arr = this.listeners.get(event);
      if (arr) {
        this.listeners.set(
          event,
          arr.filter((fn) => fn !== cb)
        );
      }
    };
  }

  off(event, cb) {
    const arr = this.listeners.get(event);
    if (arr) {
      this.listeners.set(
        event,
        arr.filter((fn) => fn !== cb)
      );
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }

  // Post events
  sendView(postId) {
    this.socket?.emit("post:view", { postId });
  }

  // Comment events
  sendTyping(postId, displayName) {
    this.socket?.emit("comment:typing", { postId, displayName });
  }

  sendStopTyping(postId, displayName) {
    this.socket?.emit("comment:stop-typing", { postId, displayName });
  }

  // Follow events (optional - backend already emits these automatically)
  sendFollow(followedId) {
    this.socket?.emit("follow:create", { followedId });
  }

  sendUnfollow(followedId) {
    this.socket?.emit("follow:remove", { followedId });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.listeners.clear();
  }
}

export default new SocketService();
