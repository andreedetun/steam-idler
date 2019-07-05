const SteamUser = require("steam-user");
const SteamTopt = require("steam-totp");
const fs = require("fs");

const file = fs.readFileSync("./config.json");
const config = JSON.parse(file);
const client = new SteamUser();

const loginOptions = {
  accountName: config.accountName,
  password: config.password,
  twoFactorCode: SteamTopt.generateAuthCode(config.sharedSecret)
};

client.logOn(loginOptions);

client.on("loggedOn", () => {
  console.log(
    `[+] Logged in as ${config.accountName}:${"*".repeat(
      config.password.length
    )} (https://steamcommunity.com/id/${client.vanityURL})`
  );
  console.log(`[+] Starting to idle ${config.games.length} games`);
  client.setPersona(SteamUser.EPersonaState.Online);
  client.gamesPlayed(config.games, true);
});
