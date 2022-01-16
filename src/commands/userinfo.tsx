import {
  CommandHandler,
  useDescription,
  useUser,
  createElement,
  Message,
  Embed,
  Field
} from "slshx";
import type {Snowflake,APIGuildMember} from "discord-api-types";

export default function warn(): CommandHandler<Env> {
  useDescription("warns a user");
  const user = useUser("user", "user to get info about");
  return async (interaction, env) => {
    if(!interaction.guild_id) return <Message ephemeral>⚠️Error: Guild was not detected.⚠️</Message>;
    console.log(interaction);
    if(!interaction.member || !interaction.member.user) return <Message ephemeral>⚠️Error: InvokeMember was not detected.⚠️</Message>;
    const guildUser = await getGuildUser(user ? user.id : interaction.member.user.id, interaction.guild_id, env);
    if(!guildUser) return <Message ephemeral>⚠️Error: GuildMember was not found.⚠️</Message>;
    if(!guildUser.user) return <Message ephemeral>⚠️Error: GuildMember did not have a valid user.⚠️</Message>;
    const embed = <Message ephemeral>
      <Embed
        title={(guildUser.nick || guildUser.user.username) + "#" + guildUser.user.discriminator}
        timestamp={new Date()}
        color={guildUser.user.accent_color || Math.round(Math.random() * 16777215)}
        thumbnail={`https://cdn.discordapp.com/avatars/${guildUser.user.id}/${guildUser.user.avatar}.webp`}
        footer={{text:"Data Fetched by Rhiannon", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Joined Discord:" inline>{convertSnowflakeToDate(guildUser.user.id)}</Field>
        <Field name="Joined Server:" inline>{convertSnowflakeToDate(guildUser.joined_at)}</Field>
        <Field name="Snowflake:">{guildUser.user.id}</Field>
        <Field name="Roles:" inline>{guildUser.roles.map(role => `<@&${role}>`).join(" ")}</Field>
      </Embed>
    </Message>
    console.log(embed.embeds[0]);
    return embed;
  };
}
function convertSnowflakeToDate(snowflake: Snowflake) : Date{
	return new Date(parseInt(snowflake) / 4194304 + 1420070400000);
}
async function getGuildUser(user: Snowflake, guild: Snowflake, env: Env) : Promise<APIGuildMember> {
  return await (await fetch(`https://discord.com/api/v9/guilds/${guild}/members/${user}`, {method:"GET",headers:{Authorization: env.TOKEN}})).json() as APIGuildMember;
}