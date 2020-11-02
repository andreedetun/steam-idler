const SteamUser = require("steam-user");
const SteamTopt = require("steam-totp");
const fs = require("fs");

const file = fs.readFileSync("./config.json");
const config = JSON.parse(file);
const client = new SteamUser();

const loginOptions = {
  accountName: config.accountName,
  password: config.password,
  promptSteamGuardCode: false,
  twoFactorCode: SteamTopt.getAuthCode(config.twoFactorCode),
  rememberPassword: true
};

if (config.accountName === "" || config.accountName === "") {
  console.log(
    "[+] Please enter your login credentials in the config.json file otherwise the bot can't login and idle."
  );
} else {
  client.logOn(loginOptions);
}

client.on("loggedOn", () => {
  console.log(
    `[+] Logged in as ${config.accountName}:${"*".repeat(
      config.password.length
    )} | (https://steamcommunity.com/id/${client.vanityURL})`
  );

  console.log(`[+] Starting to idle ${config.games.length} games`);

  // If "silent" in config is turned on we want to idle the games with the persona state offline
  if (!config.silent) {
    client.setPersona(SteamUser.EPersonaState.Online);
  }

  setTimeout(() => {
    // Max games allowed at once is 32 so if > 32 return an error to the user.
    if (config.games.length <= 32) {
      client.gamesPlayed(config.games, true);
    } else {
      console.log(
        "[+] Error: The maximum games steam allows you to play at once is only 32, please reduce the amount of games to idle."
      );
      setTimeout(() => {
        process.exit(1);
      }, 3500);
    }
  }, 3500);
});

client.on("friendMessage", (steamid, message) => {
  if (config.autResponse === true && config.responseMessage !== "") {
    client.chatMessage(steamid, config.responseMessage);
  }
});

client.on("lobbyInvite", (steamid, lobbyID) => {
  if (config.autResponse === true && config.responseMessage !== "") {
    client.chatMessage(steamid, config.responseMessage);
  }
});

// This is not tested but should work
client.on("error", e => {
  console.log(`Steam returned an error: ${e}`);
});
