import {
  CommandHandler,
  useDescription,
  createElement,
  Message,
  Embed,
  Field
} from "slshx";

export default function about(): CommandHandler<Env> {
  useDescription("displays information about the bot");
  return async () => <Message ephemeral>
    <Embed
      title={"Hello, My Name is Rhiannon!"}
      color={1598208}
      thumbnail={"https://cdn.discordapp.com/avatars/922374334159409173/00da613d16217aa6b2ff31e01ba25c1c.webp"}
      url={"https://rhiannon.cloudflare.community"}
    >
      I am a fully serverless moderation bot built on Cloudflare Workers. I am blazing fast, and available now in your area!
      <Field name="Github:" inline>https://github.com/cloudflare-community/rhiannon</Field>
      <Field name="Report Issue:" inline>https://github.com/cloudflare-community/rhiannon/issues</Field>
    </Embed>
  </Message>;
}