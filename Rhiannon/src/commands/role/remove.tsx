import {
  CommandHandler,
  useDescription,
  useUser,
  useRole,
  useString,
  createElement,
  Message,
  Embed,
  Field
} from "slshx";
import { isAdmin, createLog, removeRole, GUILD_NOT_FOUND, NOT_A_MEMBER, MUST_BE_AN_ADMIN } from "utils";

export default function remove(): CommandHandler<Env> {
  useDescription("removes a role from a user");
  const user = useUser("user", "user to remove role from", { required: true });
  const role = useRole("role", "role to remove", { required: true });
  const reason = useString("reason", "reason for removal", { required: true });
  return async (interaction, env) => {
    if (!interaction.guild_id) return GUILD_NOT_FOUND;
    if (!interaction.member) return NOT_A_MEMBER;
    if (!isAdmin(interaction.member.permissions)) return MUST_BE_AN_ADMIN;

    const roleResponse = await removeRole(user.id, interaction.guild_id, role.id, reason, env);
    
    if (roleResponse.status !== 204) {
      return <Message ephemeral>❌Error: An error occurred while attempting to remove this role.❌</Message>;
    }
  
    const msg = <Message ephemeral>
      <Embed
        title={"Removed Role from User"}
        timestamp={new Date()}
        color={5793266}
        footer={{text:"Command Executed by Rhiannon", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Target:">{`<@${user.id}>`}</Field>
        <Field name="Role:">{`<@&${role.id}>`}</Field>
        <Field name="Reason:">{reason}</Field>
        <Field name="Invoked by:">{`<@${interaction.member.user.id}>`}</Field>
      </Embed>
    </Message>;
    const res = await createLog(interaction.guild_id, msg, env);
    switch(res) {
      case "Missing Channel":
        msg.content = "⚠️Warning: This server does not currently have a moderation log channel. Any actions taken without one configured will not be logged.⚠️";
        return msg;
      case "Error while sending log":
        msg.content = "❌Error: An error occurred while attempting to send the log.❌";
      case "OK":
        return msg;
    }
  };
}
