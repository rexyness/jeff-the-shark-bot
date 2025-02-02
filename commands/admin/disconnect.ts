import { protectedCommand } from "@/utils/dfp.js";
import { getVoiceConnection } from "@discordjs/voice";

export default protectedCommand.slash({
  description: "Query text",

  execute: async ({ event, ctx }) => {
    const connection = getVoiceConnection(ctx.guildId);
    if (connection) {
      connection.destroy();
    }
    await event.reply(`Disconnected from voice channel`);
  },
});
