import {
  CommandHandler,
  useDescription,
  useUser,
  useString,
  useInteger,
  createElement,
  Message,
} from "slshx";
import {timeOut} from "./set";
import {sendDM} from "../../utils";

export default function remove(): CommandHandler<Env> {
  useDescription("removes a timeout");
  const user = useUser("user", "user to remove timeout from", { required: true });
  const reason = useString("reason", "reason for timeout removal", { required: true });
  return async (interaction, env) => {
    await sendDM(user.id, `<@${user.id}>, you have been removed from time out for ${reason}.`, env);
    if(!interaction.guild_id) return <Message ephemeral>⚠️Error: Guild was not detected.⚠️</Message>;
    await timeOut(user.id, interaction.guild_id, reason, 0, env);
    return <Message ephemeral>{`<@${user.id}>`} has been removed from time out for {reason}</Message>;
  };
}