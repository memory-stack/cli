#!/usr/bin/env node
const program = require("commander");
const {
  login,
  startDay,
  logout,
  fetchLogs,
  fetchRank,
  changeAbout,
  pushLog,
} = require("./index");

program.version("1.0.0").description("Memories of mine");

//login
program
  .command("login <username> <password>")
  .description(
    "Create an account on memoriesofmine.com and use the credentials to login"
  )
  .action((username, password) => {
    login(username, password);
  });

//logout
program
  .command("logout")
  .description("Logout current user")
  .action(() => {
    logout();
  });

//startDay
program
  .command("startday <text>")
  .description("Your headline for today")
  .action((thought) => {
    startDay(thought);
  });

//fetchLogs
program
  .command("logs")
  .description("Fetch all the logs you've posted today")
  .action(() => {
    fetchLogs();
  });

//fetchRank
program
  .command("rank")
  .description("Fetch your current rank")
  .action(() => {
    fetchRank();
  });

//changeAbout
program
  .command("about <text>")
  .description("Change your profile's about")
  .action((text) => {
    changeAbout(text);
  });

//pushLog
program
  .command("log <text>")
  .description("How are you feeling right now? What are you upto? What's up?")
  .action((text) => {
    pushLog(text);
  });

program.parse(process.argv);
