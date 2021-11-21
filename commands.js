#!/usr/bin/env node
const bcrypt = require('bcrypt');
const program = require('commander');
const path = require('path');
const fs = require('fs');
var inquirer = require('inquirer');

const {
  login,
  logout,
  fetchLogs,
  changeAbout,
  isLoggedIn,
  pushLog,
  displayAbout,
} = require('./index');

program.version('1.0.3').description('Memory Stack');

//login
program
  .command('login')
  .description(
    'Create an account on memoriesofmine.com and use the credentials to login'
  )
  .action(async () => {
    const verdict = await isLoggedIn();
    if (!verdict)
      inquirer
        .prompt([
          {
            name: 'username',
            prefix: '$',
            message: 'Enter your username',
            type: 'input',
          },
          {
            name: 'password',
            prefix: '$',
            message: 'Enter your password',
            type: 'password',
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
    else console.log('User is already logged in. Please logout to continue.');
  });

//logout
program
  .command('logout')
  .description('Logout current user')
  .action(async () => {
    const isLoggedInVar = await isLoggedIn();
    if (isLoggedInVar) logout();
    else console.log('Please login first.');
  });

//fetchLogs
program
  .command('logs')
  .description("Fetch all the logs you've posted today")
  .action(async () => {
    const isLoggedInVar = await isLoggedIn();
    if (isLoggedInVar) fetchLogs();
    else console.log('Please login first.');
  });

//pushLog
program
  .command('log <text>')
  .description("How are you feeling right now? What are you upto? What's up?")
  .action(async (text) => {
    const isLoggedInVar = await isLoggedIn();
    if (isLoggedInVar) pushLog(text);
    else console.log('Please login first.');
  });

//changeAbout
program
  .command('setbio <text>')
  .description('Change your bio')
  .action(async (text) => {
    const isLoggedInVar = await isLoggedIn();
    if (isLoggedInVar) changeAbout(text);
    else console.log('Please login first.');
  });

//displayAbout
program
  .command('bio')
  .description('Displays your current bio')
  .action(async () => {
    const isLoggedInVar = await isLoggedIn();
    if (isLoggedInVar) displayAbout();
    else console.log('Please login first.');
  });

program.parse(process.argv);
