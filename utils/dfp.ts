import { initDiscordFP } from "@discord-fp/djs";

export const dfp = initDiscordFP();

export const command = dfp.command;

export const protectedCommand = dfp.command.middleware(async ({ event, ctx, next }) => {
    //check permissions
    if (!event.isCommand()) return;
    if (event.user.id !== event.guild?.ownerId) {
      await event.reply({ content: "You are not the owner of this server." });
      return;
    }
    if (!event.guildId) {
      await event.reply({ content: "Not in a server!" });
      return;
    }

    return next({
      ctx:{
        guildId: event.guildId,
      },
      event,
    });
});
