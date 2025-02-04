import "dotenv/config";
import { dfp } from "./utils/dfp.js";
import { client } from "./utils/discord.js";
import "./events/voice_join_event"; // Import the voice join event


//store your token in environment variable or put it here
const token = process.env["TOKEN"];

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  dfp.start({
    client,
    load: ["./commands"],
  });
});

client.login(token);

