#!/usr/bin/env node
const program = require('commander');
var inquirer = require('inquirer');

const {
  login,
  logout,
  fetchLogs,
  changeAbout,
  isLoggedIn,
  pushLog,
  displayAbout,
  handleColorSetting,
} = require('./index');

program.version('2.0.3').description('Memory Stack');

//login
program
  .command('login')
  .description(
    'Create an account on memorystack.live/signup and use the credentials to login'
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

//settings
program
  .command('set <option>')
  .description('Change user settings')
  .action(async (option) => {
    const isLoggedInVar = await isLoggedIn();
    if (isLoggedInVar) {
      switch (option) {
        case 'color':
          const colorList = [
            'Red',
            'Orange',
            'Yellow',
            'Green',
            'Teal',
            'Blue',
            'Purple',
            'Pink',
          ];
          inquirer
            .prompt([
              {
                name: 'color',
                message: 'Select the color.',
                choices: colorList,
                type: 'rawlist',
              },
            ])
            .then((input) => handleColorSetting(input.color));
      }
    } else console.log('Please login first.');
  });

program.parse(process.argv);
