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
import {isModerator, getPermsFromRoles, getGuildUser} from "../utils";

export default function userinfo(): CommandHandler<Env> {
  useDescription("gets info about user");
  const user = useUser("user", "user to get info about");
  return async (interaction, env) => {
    if(!interaction.guild_id) return <Message ephemeral>❌Error: Guild was not detected.❌</Message>;
    if(!interaction.member) return <Message ephemeral>❌Error: You must be a member of this guild to use this command.❌</Message>;
    if(!(await isModerator(interaction, env))) return <Message ephemeral>❌Error: You must be a moderator to use this command.❌</Message>;
    if(!interaction.member || !interaction.member.user) return <Message ephemeral>❌Error: InvokeMember was not detected.❌</Message>;
    const guildUser = await getGuildUser(user ? user.id : interaction.member.user.id, interaction.guild_id, env);
    if(!guildUser) return <Message ephemeral>❌Error: GuildMember was not found.❌</Message>;
    if(!guildUser.user) return <Message ephemeral>❌Error: GuildMember did not have a valid user.❌</Message>;
    const roles : string[] = await getPermsFromRoles(guildUser.roles, interaction.guild_id, env);
    return <Message ephemeral>
      <Embed
        title={(guildUser.nick || guildUser.user.username) + "#" + guildUser.user.discriminator}
        timestamp={new Date()}
        color={guildUser.user.accent_color || Math.round(Math.random() * 16777215)}
        thumbnail={`https://cdn.discordapp.com/avatars/${guildUser.user.id}/${guildUser.user.avatar}.webp`}
        footer={{text:"Command Executed by Rhiannon", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        {`<@${guildUser.user.id}>`}
        <Field name="Joined Discord:" inline>{`<t:${Math.round(convertSnowflakeToDate(guildUser.user.id).getTime()/1000)}:F>`}</Field>
        <Field name="Joined Server:" inline>{`<t:${Math.round(new Date(guildUser.joined_at).getTime()/1000)}:F>`}</Field>
        <Field name="User ID:">{guildUser.user.id}</Field>
        <Field name="Roles:">{guildUser.roles.length !== 0 ? guildUser.roles.map(role => `<@&${role}>`).join(" ") : "None"}</Field>
      </Embed>
    </Message>;
  };
}

function convertSnowflakeToDate(snowflake: Snowflake) : Date {
	return new Date(parseInt(snowflake) / 4194304 + 1420070400000);
}