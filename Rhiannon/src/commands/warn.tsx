import {
  CommandHandler,
  useDescription,
  useUser,
  useString,
  createElement,
  Message,
  Embed,
  Field
} from "slshx";
import {validatePermissions,sendDM,createLog} from "utils";

export default function warn(): CommandHandler<Env> {
  useDescription("warns a user");
  const user = useUser("user", "user to warn", { required: true });
  const warning = useString("warning", "warning message", { required: true });
  return async (interaction, env) => {
    const valid = await validatePermissions(interaction, env);
    if(valid) return valid;
    await sendDM(user.id, warning, env);
    const msg = <Message ephemeral>
      <Embed
        title={"Warned User"}
        timestamp={new Date()}
        color={16776960}
        thumbnail={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`}
        footer={{text:"Command Executed by Vanguard", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Target:">{`<@${user.id}>`}</Field>
        <Field name="Warning:">{warning}</Field>
        <Field name="Invoked By:">{`<@${interaction.member!.user.id}>`}</Field>
      </Embed>
    </Message>;
    await createLog(interaction.guild_id!, msg, env);
    return msg;
  };
}