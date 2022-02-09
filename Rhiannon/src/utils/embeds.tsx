import { createElement, Embed, Field, Message } from "slshx";
import type { APIInteractionResponseCallbackData } from "discord-api-types";

export function errorEmbed(msg: string, ray?: string) : APIInteractionResponseCallbackData {
  return <Message>
    <Embed
      title={"❌ Error ❌"}
      timestamp={new Date()}
      color={15548997}
      footer={{text: ray ? `Ray ID: ${ray}` : "Command Executed by Vanguard", iconUrl:`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}}
    >
      {ray ? "To check on the status of your error, use the ray ID below when contacting support." : ""}
      <Field name="Error:">`{msg}`</Field>
    </Embed>
  </Message>;
}