const fs = require('fs');
var inquirer = require('inquirer');
const path = require('path');
const homedir = require('os').homedir();
const folderDirectory = path.join(homedir, '.memory-stack');
const dirr = path.join(folderDirectory, 'credentials.json');

const {
  postRequest,
  postRequestSecure,
  getRequestSecure,
} = require('./data/remote/api');

function callback(err) {}

const createDirectory = async () => {
  fs.access(folderDirectory, function (error) {
    if (error) {
      fs.mkdir(folderDirectory, callback);
    }

    wipeData();
  });
};

const wipeData = async () => {
  fs.writeFile(dirr, '', 'utf8', callback);
};

const writeCredentials = async (content) => {
  fs.writeFile(dirr, JSON.stringify(content), 'utf8', callback);
};

const readCredentials = async () => {
  const toReturn = await JSON.parse(fs.readFileSync(dirr, 'utf8'));
  return toReturn;
};

const readJWT = async () => {
  var jwt = await JSON.parse(fs.readFileSync(dirr, 'utf8'))['jwt'];
  return jwt;
};

const readDate = async () => {
  var thoughtDate = await JSON.parse(fs.readFileSync(dirr, 'utf8'))[
    'thoughtDate'
  ];
  return thoughtDate;
};

const isLoggedIn = async () => {
  try {
    JSON.parse(fs.readFileSync(dirr, 'utf8'))['jwt'];
    return true;
  } catch (error) {
    return false;
  }
};

const login = async (username, password) => {
  createDirectory();

  var res = await postRequest('login', {
    username: username,
    password: password,
  });
  verdict = res.data.success;
  message = res.data.message;
  error = res.data.error;

  if (verdict == true) {
    jwt = message;
    console.log('Login successful!');

    //on successful login
    const toWrite = {
      thoughtDate: '0',
      jwt: jwt,
    };
    writeCredentials(toWrite);
  } else {
    console.log(error);
  }
};

const logout = () => {
  //on successful logout
  console.log('Logout successful!');
  wipeData();
};
const startDay = async () => {
  const today = new Date();
  var jwt = await readJWT();
  await inquirer
    .prompt([
      {
        name: 'thought',
        prefix: '$',
        message: "What's the heading of today?",
        type: 'input',
      },
    ])
    .then((input) => {
      // console.log(input.thought);
      postRequestSecure('setThought', { thought: input.thought }, jwt);
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });

  var toWrite = await readCredentials();
  toWrite['thoughtDate'] = today.getDate();
  writeCredentials(toWrite);
};

const fetchLogs = async () => {
  var jwt = await readJWT();
  var res = await getRequestSecure('todaysLogs', jwt);
  res = res.data.logs;

  var nowDate = new Date();
  var currentDate = nowDate.toDateString();
  console.log();

  console.log(currentDate);

  for (const singleLog of res) {
    var logDateTime = singleLog['createdAt'];
    // console.log(Date(logDateTime) - Date(nowDate));

    var log = singleLog['logMessage'];
    var dateParsed = new Date(logDateTime);
    var logHour = dateParsed.getHours();
    var logMinute = dateParsed.getMinutes();
    var logSecond = dateParsed.getSeconds();

    if (logHour < 10) logHour = '0' + logHour.toString();
    if (logMinute < 10) logMinute = '0' + logMinute.toString();
    if (logSecond < 10) logSecond = '0' + logSecond.toString();

    logHour = logHour.toString();
    logMinute = logMinute.toString();
    logSecond = logSecond.toString();

    console.log(`${logHour}:${logMinute}:${logSecond} -> ${log}`);
  }
  console.log();
};

const displayAbout = async () => {
  var jwt = await readJWT();
  var res = await getRequestSecure('about', jwt);
  console.log(res.data.about);
};

const changeAbout = async (text) => {
  var jwt = await readJWT();
  var res = await postRequestSecure('setAbout', { about: text }, jwt).catch(
    (error) => {
      console.log(error);
    }
  );
  res = res.data.message;
  console.log(res);
};

const pushLog = async (log) => {
  var jwt = await readJWT();
  var today = new Date();
  var time = today.toLocaleTimeString('en-GB', { hour12: true });
  var timeArray = time.split(':');
  if (timeArray[0] < 10) time = '0' + time;
  var res = await postRequestSecure(
    'createLog',
    {
      text: log,
      date: today.toLocaleDateString('en-GB'),
      time: time,
    },
    jwt
  ).catch((error) => {
    console.log('error');
  });
  let message = res.data.message;
  let logNumber = res.data.logNumber;
  console.log(`Log #${logNumber}`);
};

//Settings submodules
const handleColorSetting = async (selectedColor) => {
  var jwt = await readJWT();
  var res = await postRequestSecure(
    'setUserColor',
    {
      color: selectedColor.toLowerCase(),
    },
    jwt
  );
  console.log(res.data.message);
};

module.exports = {
  logout,
  login,
  pushLog,
  fetchLogs,
  isLoggedIn,
  changeAbout,
  displayAbout,
  handleColorSetting,
};
