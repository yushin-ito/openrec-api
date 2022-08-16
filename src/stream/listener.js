import EventEmitter from "events";
import WebSocket from "ws";
import OpenrecAPI from "../openrec-api.js";

class ChatListener extends EventEmitter {
  constructor(userId) {
    super();
    this.userId = userId;
  }

  async startListener() {
    const openrec = new OpenrecAPI();
    const liveInfo = await openrec.getLiveInfo(this.userId);
    this.roomId = liveInfo["movie_id"];
    if (this.roomId) {
      const url = `wss://chat.openrec.tv/socket.io/?movieId=${this.roomId}&EIO=3&transport=websocket`;
      this.ws = this.generateWebSocket(url);
    }
  }

  stopListener() {
    if (this.ws) {
      this.ws.close();
    }
  }

  isListening() {
    return this.ws ? this.ws.readyState === 1 : false;
  }

  generateWebSocket(url) {
    const ws = new WebSocket(url);
    ws.on("open", async () => {
      this.emit("open");
    });

    ws.on("error", async (error) => {
      this.emit("error", error);
    });

    ws.on("message", async (data) => {
      if (data) {
        const message = data.toString();
        switch (message[0]) {
          case "0":
            const setting = JSON.parse(message.slice(1));
            this.pingInterval = setting.pingInterval;
            setInterval(() => {
              ws.send("2");
            }, setting.pingInterval);
            console.log(setting);
            break;
          case "4":
            if (message.slice(2)) {
              const chat = JSON.parse(message.slice(2));
              const chatInfo = JSON.parse(chat[1]);
              console.log(chatInfo)
              switch (chatInfo.type) {
                case 0:
                  this.emit("onChat", chatInfo.data);
                  break;
                case 1:
                  this.emit("onLiveViewers", chatInfo.data);
                  break;
              }
            }
            break;
        }
      }
    });

    ws.on("close", async () => {
      this.emit("close");
    });

    return ws;
  }
}
export default ChatListener;
