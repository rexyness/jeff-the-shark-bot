import { client } from "@/utils/discord.js";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  StreamType,
  VoiceConnectionStatus
} from "@discordjs/voice";
import { VoiceState } from "discord.js";
import { createReadStream } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const player = createAudioPlayer();
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
    if (connection) return;
    try {
      const connection = joinVoiceChannel({
        channelId: jeffChannel.id,
        guildId: jeffChannel.guild.id,
        adapterCreator: jeffChannel.guild.voiceAdapterCreator,
      });

      
      connection.subscribe(player);
      player.play(jeffStream());

      player.on(AudioPlayerStatus.Playing, () => {
        console.log('The audio player has started playing!' , jeffStream().metadata);
      });
      
      player.on(AudioPlayerStatus.Idle, () => {
       
        player.play(jeffStream());
      });

      player.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource?.metadata}`);
        // player.play(jeffStream());
    });

      connection.on(VoiceConnectionStatus.Disconnected, () => {
        connection.destroy();
      });
    } catch (e) {
      console.log("Error caught:", e);
    }
  }
);

const jeffStream = () => {
    return createAudioResource(
        createReadStream(getAssetsPath('jeff_singing_marv.opus'))
      , { inputType: StreamType.OggOpus }      
      );
}


export function getProjectRoot(): string {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return join(__dirname, '..');
  }
  
  export function getAssetsPath(...args: string[]): string {
    return join(getProjectRoot(), 'assets', ...args);
  }