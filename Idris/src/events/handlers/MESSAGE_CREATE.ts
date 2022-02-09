import profanity from "leo-profanity";
import type {APIMessage} from "discord-api-types";
export default async function MESSAGE_CREATE(data: APIMessage, env: Environment) : Promise<void>{
  const content = data.content;
  if(!content) return;
  const profanity_check = profanity.check(content);

}

async function phisherCheck(content: string, env: Environment) : Promise<boolean> {
  const urls = content.match(new RegExp("(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))","g")).map(u => new URL(u).hostname);
  const results : PhishermanResponse[] = await Promise.all(urls.map(u => 
    (await fetch(`https://api.phisherman.gg/v2/domains/check/${u}`, {headers:{Authorization: env.PHISHERMAN_TOKEN}})).json()
  ));
}

declare type PhishermanResponse = {
  classification: "safe" | "suspicious" | "malicious";
  verifiedPhish: boolean;
}