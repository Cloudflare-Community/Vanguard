import {
  CommandHandler,
  useDescription,
  createElement,
  Message,
  Embed,
  useButton,
  Field,
  useString
} from "slshx";
import type {Snowflake} from "discord-api-types";
import {createLog,validatePermissions} from "../utils";

export default function leave(): CommandHandler<Env> {
  useDescription("makes Vanguard leave the server");
  const reason = useString("reason", "reason for removing v", { required: true });
  const cancel = useButton(() => {
    return <Message update ephemeral>Leave has been cancelled.</Message>;
  });
  const buttonId = useButton(async (interaction, env: Env, ctx) => {
    if(!interaction.guild_id || !interaction.member) throw new Error("Invalid interaction.");
    const msg = <Message ephemeral>
      <Embed
        title={"Vanguard has been removed from the server. Have a nice day!"}
        timestamp={new Date()}
        color={15548997}
        thumbnail={`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}
      >
        <Field name="Reason:">{reason}</Field>
        <Field name="Invoked By:">{`<@${interaction.member.user.id}>`}</Field>
      </Embed>
    </Message>;
    await createLog(interaction.guild_id, msg, env);
    ctx.waitUntil(leaveGuild(interaction.guild_id, env));
    return msg;
  });
  return async (interaction, env: Env) => {
    const isInvalid = await validatePermissions(interaction, env);
    if(isInvalid) return isInvalid;
    return <Message ephemeral>
      <Embed
        title={"Please confirm that you would like to make Vanguard leave the server."}
        timestamp={new Date()}
        color={15548997}
        thumbnail={`https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp`}
      >
        Use the buttons below to make your selection.
      </Embed>
    </Message>;
  };
}

async function leaveGuild(guild: Snowflake, env: Env) : Promise<Response> {
  await sleep(1000);
  return fetch(`https://discord.com/api/v9/users/@me/guilds${guild}`, {method:"DELETE",headers:{Authorization: env.TOKEN}});
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms, []));
}