import type {APIChatInputApplicationCommandInteractionData,APIInteractionGuildMember,APIMessage,APIUser,InteractionType,Snowflake} from "discord-api-types";

declare type ValidatedInteraction = {
  application_id: Snowflake,
  channel_id: Snowflake,
  guild_id: Snowflake,
  id: Snowflake,
  data: APIChatInputApplicationCommandInteractionData,
  member: APIInteractionGuildMember,
  user: APIUser,
  message: APIMessage | undefined,
  token: string,
  version: 1,
  type: InteractionType.ApplicationCommand,
};