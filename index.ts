import "dotenv/config";
import { dfp } from "./utils/dfp.js";
import { client } from "./utils/discord.js";
import { VoiceState } from "discord.js";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { ASSETS_REPO } from "./utils/assets.js";

//store your token in environment variable or put it here
const token = process.env["TOKEN"];

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  dfp.start({
    client,
    load: ["./commands"],
  });
});

client.on(
  "voiceStateUpdate",
  async (oldState: VoiceState, newState: VoiceState) => {
    const jeffChannelId = "1335676270419247168";
    const guild = newState.guild;
    const jeffChannel = client.channels.cache.get(jeffChannelId);
    if (!jeffChannel || !jeffChannel.isVoiceBased()) return;
    const BOT_USER_ID = "1335677099700387870";
    const onlyBotInTheChannel =
      jeffChannel.members.size === 1 && jeffChannel.members.has(BOT_USER_ID);
    const connection = getVoiceConnection(jeffChannel.guild.id);
    if (jeffChannel.members.size === 0 || onlyBotInTheChannel) {
      if (connection) {
        connection.disconnect();
      }
      return;
    }
    if(connection) return;
    try {
      const connection = joinVoiceChannel({
        channelId: jeffChannel.id,
        guildId: jeffChannel.guild.id,
        adapterCreator: jeffChannel.guild.voiceAdapterCreator,
      });

      console.log("Voice connection established:", connection);

      const player = createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Play },
      });
      const jeffSingingFilePath = ASSETS_REPO.jeffSinging;

      connection.subscribe(player);
      const resource = createAudioResource(jeffSingingFilePath, {
        inputType: StreamType.OggOpus,
      });
      player.play(resource);
      player.on(AudioPlayerStatus.Idle, () => {
        const resource = createAudioResource(jeffSingingFilePath, {
          inputType: StreamType.OggOpus,
        });
        player.play(resource);
      });

      connection.on(VoiceConnectionStatus.Disconnected, () => {
        connection.destroy();
      });
    } catch (e) {
      console.log("Error caught:", e);
    }
  }
);

client.login(token);
