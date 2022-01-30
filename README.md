# Rhiannon

Built using [Slshx](https://github.com/mrbbot/slshx), [Miniflare](https://github.com/cloudflare/miniflare), [Cloudflare Workers](https://workers.cloudflare.com), and [ESBuild](https://esbuild.github.io)

An as-yet fully serverless Discord Moderation Bot. Documentation will probably come at some point

Currently Implemented Feature:
- Warn
- Timeout
- Kick
- Ban
- Userinfo
- Tags
- Permissions System
- Logs
- Leave

In progress:
- Notes, disabled, currently tracking issue with [Slshx](https://github.com/mrbbot/slshx/issues/1)

Roadmap Features:
- Anti-Spam/Anti-Scam(Coming with Gateway Support Soon)

## Setup

1. Create an Application on Discord - https://discord.com/developers/applications

2. Copy `env.example.jsonc` to `env.jsonc`
    1. Fill in `"testServerId"` with the server ID
    2. Fill in `"applicationId"` with the application ID found in "General Information"
    3. Fill in `"applicationPublicKey"` with the application public key found in "General Information"
    4. Fill in `"applicationSecret"` with the client secret found in "OAuth2 -> General"

3. Create a bot for the application

4. Create a `.env` file
    1. Fill in `SLSHX_APPLICATION_ID` with the application ID found in "General Information"
    2. Fill in `SLSHX_APPLICATION_PUBLIC_KEY` with the application public key found in "General Information"
    3. Fill in `SLSHX_APPLICATION_SECRET` with the client secret found in "OAuth2 -> General"
    4. Fill in `SLSHX_SERVER_ID` with the server ID
    5. Fill in `TOKEN` with the bot token
    
    The file should look like this:
    ```
    SLSHX_APPLICATION_ID=1000000000000000
    SLSHX_APPLICATION_PUBLIC_KEY=b4b323c9dba1391fce525c60fdb5300a28f7b7f731afb8c9afe0be19790e9f83
    SLSHX_APPLICATION_SECRET=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    SLSHX_TEST_SERVER_ID=2222222222222222

    TOKEN=AAAAAAAAAAAAAAAA.BBBBB.CCCCCCCCCCCCCCCC
    ```

5. Setup [Tunnels](https://developers.cloudflare.com/cloudflare-one/tutorials/single-command) or [ngrok](https://ngrok.com/docs) on port 8787 and enjoy!