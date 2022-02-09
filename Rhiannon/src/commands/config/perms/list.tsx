import {
  CommandHandler,
  useDescription,
  createElement,
  Message,
  Embed,
  Field
} from "slshx";
import {isAdmin} from "../../../utils";

export default function list(): CommandHandler<Env> {
  useDescription("lists all roles with moderation permissions");
  return async (interaction, env) => {
    if(!interaction.guild_id) return <Message ephemeral>❌Error: Guild was not detected.❌</Message>;
    if(!interaction.member) return <Message ephemeral>❌Error: You must be a member of this guild to use this command.❌</Message>;
    if(!isAdmin(interaction.member.permissions)) return <Message ephemeral>❌Error: You must be an admin to use this command.❌</Message>;
    const arr = (await env.KV.list({prefix:`Config-${interaction.guild_id}-perms-`})).keys;
    if(arr.length === 0) return <Message ephemeral>No roles have moderation permissions.</Message>; 
    const messArr = [];
    for(let r of arr)
      messArr.push(`<@&${r.name.replace(`Config-${interaction.guild_id}-perms-`, "")}>`);
    return <Message ephemeral>
      <Embed
        title={"Roles currently on the Moderation List"}
        timestamp={new Date()}
        color={5793266}
        footer={{text:"Command Executed by Vanguard", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        Note that having the `Administrator` permission bypasses moderation role checking.
        <Field name="Roles:">{messArr.join(" ")}</Field>
        <Field name="Invoked by:">{`<@${interaction.member.user.id}>`}</Field>
      </Embed>
    </Message>;
  };
}