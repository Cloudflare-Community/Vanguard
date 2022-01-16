import {
  CommandHandler,
  useDescription,
  useUser,
  useString,
  createElement,
  Message,
} from "slshx";
import {sendDM} from "../utils";

export default function warn(): CommandHandler<Env> {
  useDescription("warns a user");
  const user = useUser("user", "user to warn", { required: true });
  const warning = useString("warning", "warning message", { required: true });
  return async (interaction, env) => {
    await sendDM(user.id, `<@${user.id}>, you have been warned for ${warning}.`, env);
    return <Message ephemeral>{`<@${user.id}>`} has been warned for {warning}</Message>;
  };
}