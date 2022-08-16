import ChatListener from "../src/stream/listener.js";

const listener = new ChatListener("toranomonnews");

await listener.startListener()