import { ASSETS_REPO } from "@/utils/assets.js";
import { protectedCommand } from "@/utils/dfp.js";
import { client } from "@/utils/discord.js";
import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
    StreamType,
    VoiceConnectionStatus
} from "@discordjs/voice";
import { ChannelType } from "discord.js";

export default protectedCommand.slash({
  description:
    "Joins the voice channel you are in and plays a sound clip of Jeff singing",

  async execute({ event, ctx }) {
    const channelToJoin = client.channels.cache.find(
      (channel) =>
        channel.type == ChannelType.GuildVoice &&
        channel.members.has(event.user.id)
    );
    if (!channelToJoin) {
      await event.reply("You must be in a voice channel to use this command");
      return;
    }
    const eventGuild = event.guild;
    if (!eventGuild) {
      await event.reply("Error: Guild not found");
      return;
    }
    if (channelToJoin?.type !== ChannelType.GuildVoice) return;
    try {
      const connection = joinVoiceChannel({
        channelId: channelToJoin.id,
        guildId: ctx.guildId,
        adapterCreator: eventGuild.voiceAdapterCreator,
        
      });

      console.log("Voice connection established:", connection);

      const player = createAudioPlayer({behaviors:{noSubscriber:NoSubscriberBehavior.Play}});
      const jeffSingingFilePath = ASSETS_REPO.jeffSinging;

      
      connection.subscribe(player);
      const resource = createAudioResource(jeffSingingFilePath,{inputType:StreamType.OggOpus});
      player.play(resource);
      player.on(AudioPlayerStatus.Idle, () => {
       const resource = createAudioResource(jeffSingingFilePath,{inputType:StreamType.OggOpus});
      player.play(resource);
      });
    
      connection.on(VoiceConnectionStatus.Disconnected, () => {
        connection.destroy();
      });
    } catch (e) {
      console.log("Error caught:", e);
    } finally {
      await event.reply("Connected to voice channel");
    }
  },
});
