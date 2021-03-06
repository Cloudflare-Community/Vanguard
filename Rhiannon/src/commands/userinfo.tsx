import {
  CommandHandler,
  useDescription,
  useUser,
  createElement,
  Message,
  Embed,
  Field
} from "slshx";
import type {Snowflake} from "discord-api-types";
import {validatePermissions, getGuildUser} from "../utils";

export default function userinfo(): CommandHandler<Env> {
  useDescription("gets info about user");
  const user = useUser("user", "user to get info about");
  return async (interaction, env) => {
    const isInvalid = await validatePermissions(interaction, env);
    if(isInvalid) return isInvalid;
    const guildUser = (!user || interaction.user!.id === user.id) ? (() => {
      const member = interaction.member!;
      if(!member.user) member.user = interaction.user!;
      return member;
    })() : await getGuildUser(user ? user.id : interaction.user!.id, interaction.guild_id!, env);
    if(!guildUser) return <Message ephemeral>❌Error: GuildMember was not found.❌</Message>;
    return <Message ephemeral>
      <Embed
        title={(guildUser.nick || guildUser.user!.username) + "#" + guildUser.user!.discriminator}
        timestamp={new Date()}
        color={guildUser.user!.accent_color || Math.round(Math.random() * 16777215)}
        thumbnail={`https://cdn.discordapp.com/avatars/${guildUser.user!.id}/${guildUser.user!.avatar}.webp`}
        footer={{text:"Command Executed by Vanguard", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        {`<@${guildUser.user!.id}>`}
        <Field name="Joined Discord:" inline>{`<t:${Math.round(convertSnowflakeToDate(guildUser.user!.id).getTime()/1000)}:F>`}</Field>
        <Field name="Joined Server:" inline>{`<t:${Math.round(new Date(guildUser.joined_at).getTime()/1000)}:F>`}</Field>
        <Field name="User ID:">{guildUser.user!.id}</Field>
        <Field name="Roles:">{guildUser.roles.length !== 0 ? guildUser.roles.map(role => `<@&${role}>`).join(" ") : "None"}</Field>
      </Embed>
    </Message>;
  };
}

function convertSnowflakeToDate(snowflake: Snowflake) : Date {
	return new Date(parseInt(snowflake) / 4194304 + 1420070400000);
}