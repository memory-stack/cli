#!/usr/bin/env node
const bcrypt = require("bcrypt");
const program = require("commander");
const path = require("path");
const fs = require("fs");
var inquirer = require("inquirer");

const {
  login,
  logout,
  fetchLogs,
  changeAbout,
  isLoggedIn,
  pushLog,
} = require("./index");

program.version("1.0.1").description("Memory Stack");

//login
program
  .command("login")
  .description(
    "Create an account on memoriesofmine.com and use the credentials to login"
  )
  .action(async () => {
    inquirer
      .prompt([
        {
          name: "username",
          prefix: "$",
          message: "Enter your username",
          type: "input",
        },
        {
          name: "password",
          prefix: "$",
          message: "Enter your password",
          type: "password",
        },
      ])
      .then((input) => {
        login(input.username, input.password);
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      });
  });

//logout
program
  .command("logout")
  .description("Logout current user")
  .action(async () => {
    const isLoggedInVar = await isLoggedIn();
    if (isLoggedInVar) logout();
    else console.log("Please login first.");
  });

//fetchLogs
program
  .command("logs")
  .description("Fetch all the logs you've posted today")
  .action(async () => {
    const isLoggedInVar = await isLoggedIn();
    if (isLoggedInVar) fetchLogs();
    else console.log("Please login first.");
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
  .action(async (text) => {
    const isLoggedInVar = await isLoggedIn();
    if (isLoggedInVar) changeAbout(text);
    else console.log("Please login first.");
  });

//pushLog
program
  .command("log <text>")
  .description("How are you feeling right now? What are you upto? What's up?")
  .action(async (text) => {
    const isLoggedInVar = await isLoggedIn();
    if (isLoggedInVar) pushLog(text);
    else console.log("Please login first.");
  });

program.parse(process.argv);
