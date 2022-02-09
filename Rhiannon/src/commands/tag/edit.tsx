import {
  CommandHandler,
  useDescription,
  useString,
  createElement,
  Message,
  Embed,
  Field
} from "slshx";
import {validatePermissions,createLog} from "../../utils";

export default function edit(): CommandHandler<Env> {
  useDescription("edits(overwrites) a tag");
  const name = useString("name", "name of tag", { required: true,
    async autocomplete(interaction, env: Env, ctx) {
      if(!interaction.guild_id) return [];
      const tags = await env.KV.list({ prefix: `Tags-${interaction.guild_id}-${name}` }) as KVNamespaceListResult<string>;
      return tags.keys.map((tag) => tag.name.replace(`Tags-${interaction.guild_id}-`, ""));
    } 
  });
  const content = useString("content", "contents of tag", { required: true });
  return async (interaction, env) => {
    const isInvalid = await validatePermissions(interaction, env);
    if(isInvalid) return isInvalid;
    await env.KV.put(`Tags-${interaction.guild_id}-${name}`, content);
    const msg = <Message ephemeral>
      <Embed
        title={`Edited Tag`}
        timestamp={new Date()}
        color={5793266}
        footer={{text:"Command Executed by Vanguard", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Name:">{name}</Field>
        <Field name="Content:">{content}</Field>
        <Field name="Invoked By:">{`<@${interaction.member.user.id}>`}</Field>
      </Embed>
    </Message>;
    await createLog(interaction.guild_id!, msg, env);
    return msg;
  };
}