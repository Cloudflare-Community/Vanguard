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
import { isAdmin, createLog, addRole, GUILD_NOT_FOUND, NOT_A_MEMBER, MUST_BE_AN_ADMIN } from "utils";

export default function add(): CommandHandler<Env> {
  useDescription("adds a role to a user");
  const user = useUser("user", "user to add role to", { required: true });
  const role = useRole("role", "role to add", { required: true });
  const reason = useString("reason", "reason for adding role", { required: true });
  return async (interaction, env) => {
    if (!interaction.guild_id) return GUILD_NOT_FOUND;
    if (!interaction.member) return NOT_A_MEMBER;
    if (!isAdmin(interaction.member.permissions)) return MUST_BE_AN_ADMIN;
    const roleResponse = await addRole(user.id, interaction.guild_id, role.id, reason, env);

    if (roleResponse.status !== 204) {
      return <Message ephemeral>❌Error: An error occurred while attempting to add the role.❌</Message>;
    }

    const msg = <Message ephemeral>
      <Embed
        title={"Added Role to User"}
        timestamp={new Date()}
        color={5793266}
        footer={{text:"Command Executed by Vanguard", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
      >
        <Field name="Target:">{`<@${user.id}>`}</Field>
        <Field name="Role:">{`<@&${role.id}>`}</Field>
        <Field name="Reason:">{reason}</Field>
        <Field name="Invoked by:">{`<@${interaction.member.user.id}>`}</Field>
      </Embed>
    </Message>;
    await createLog(interaction.guild_id!, msg, env);
    return msg;
  };
}
