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

export default function warn(): CommandHandler<Env> {
  useDescription("warns a user");
  const user = useUser("user", "user to get info about");
  return async (interaction, env) => {
    interaction.member
    if(!interaction.guild_id) return <Message ephemeral>❌Error: Guild was not detected.❌</Message>;
    if(!interaction.member) return <Message ephemeral>❌Error: You must be a member of this guild to use this command.❌</Message>;
    if(!(await isModerator(interaction, env))) return <Message ephemeral>❌Error: You must be a moderator to use this command.❌</Message>;
    if(!interaction.member || !interaction.member.user) return <Message ephemeral>❌Error: InvokeMember was not detected.❌</Message>;
    const guildUser = await getGuildUser(user ? user.id : interaction.member.user.id, interaction.guild_id, env);
    if(!guildUser) return <Message ephemeral>❌Error: GuildMember was not found.❌</Message>;
    if(!guildUser.user) return <Message ephemeral>❌Error: GuildMember did not have a valid user.❌</Message>;
    const roles : string[] = await getPermsFromRoles(guildUser.roles, interaction.guild_id, env);
    console.log(guildUser.joined_at)
    return <Message ephemeral>
      <Embed
        timestamp={new Date()}
        color={guildUser.user.accent_color || Math.round(Math.random() * 16777215)}
        thumbnail={`https://cdn.discordapp.com/avatars/${guildUser.user.id}/${guildUser.user.avatar}.webp`}
        footer={{text:"Command Executed by Rhiannon", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        {`<@${guildUser.user.id}>`}
        <Field name="Joined Discord:" inline>{convertSnowflakeToDate(guildUser.user.id)}</Field>
        <Field name="Joined Server:" inline>{new Date(guildUser.joined_at)}</Field>
        <Field name="Permissions">{roles.map(e => e.toLowerCase().split("_").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ")).join(", ")}</Field>
        <Field name="Snowflake:" inline>{guildUser.user.id}</Field>
        <Field name="Roles:" inline>{guildUser.roles.map(role => `<@&${role}>`).join(" ")}</Field>
      </Embed>
    </Message>;
  };
}

function convertSnowflakeToDate(snowflake: Snowflake) : Date {
	return new Date(parseInt(snowflake) / 4194304 + 1420070400000);
}