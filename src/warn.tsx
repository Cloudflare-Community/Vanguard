import {
  CommandHandler,
  useDescription,
  useUser,
  useString,
  createElement,
  Message,
} from "slshx";
import {sendDM} from "./utils";

// `Env` contains bindings and is declared in types/env.d.ts
export function warn(): CommandHandler<Env> {
  useDescription("Sends Warning Message");
  const user = useUser("user", "user to warn", { required: true });
  const warning = useString("warning", "warning message", { required: true });
  return async (interaction, env, ctx) => {
    if(!interaction.data.options) return <Message ephemeral>Interaction options missing.</Message>;
    let user, warning;
    for(let option of interaction.data.options) 
      if(option.type === 6 && option.name === "user") user = option.value;
      else if(option.type === 3 && option.name === "warning") warning = option.value;
    if(!user || !warning) return <Message ephemeral>Missing user or warning.</Message>;
    await sendDM(user, `<@${user}>, you have been warned for ${warning}.`, env);
    return <Message ephemeral>{`<@${user}>`} has been warned for {warning}</Message>;
  };
}