const moment = require("moment");
const SteamUser = require("steam-user");
const SteamTopt = require("steam-totp");
const fs = require("fs");

const file = fs.readFileSync("./config.json");
const config = JSON.parse(file);

function log(message) {
  moment.locale("se");
  let log = `[${moment().format("L LTS").green}] ${message.grey}`;
  console.log(log);
  fs.appendFileSync("log.txt", log + "\n");
}

const client = new SteamUser();

const loginOptions = {
  accountName: config.accountName,
  password: config.password,
  twoFactorCode: SteamTopt.generateAuthCode(config.sharedSecret)
};

client.logOn(loginOptions);

client.on("loggedOn", () => {
  client.setPersona(SteamUser.EPersonaState.Online);

  let games = config.games;

  games.forEach(g => {
    client.gamesPlayed(g, true);
  });
});
