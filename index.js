const fs = require("fs");
const bcrypt = require("bcrypt");
var inquirer = require("inquirer");

const {
  postRequest,
  postRequestSecure,
  getRequestSecure,
} = require("./data/remote/api");
const path = require("path");

function callback(err) {}

const isLoggedIn = async () => {
  var dirr = path.join(__dirname, "data/local", "credentials.json");
  try {
    JSON.parse(fs.readFileSync(dirr, "utf8"))["jwt"];
    return true;
  } catch (error) {
    return false;
  }
};

const login = async (username, password) => {
  var res = await postRequest("login", {
    username: username,
    password: password,
  });
  verdict = res.data.result;
  message = res.data.message;

  if (verdict == "true") {
    jwt = message;
    console.log("Login successful!");

    //on successful login
    const toWrite = {
      thoughtDate: "0",
      jwt: jwt,
    };
    var dirr = path.join(__dirname, "data/local", "credentials.json");

    fs.writeFile(dirr, JSON.stringify(toWrite), "utf8", callback);
  } else {
    console.log(message);
  }
};

const logout = () => {
  //on successful logout
  var dirr = path.join(__dirname, "data/local", "credentials.json");
  console.log("Logout successful!");
  fs.writeFile(dirr, "", "utf8", callback);
};
const startDay = async () => {
  const today = new Date();
  var dirr = path.join(__dirname, "data/local", "credentials.json");

  await inquirer
    .prompt([
      {
        name: "thought",
        prefix: "$",
        message: "What's the heading of today? (in double quotes)",
        type: "input",
      },
    ])
    .then((input) => {
      console(input.thought);
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });

  var toWrite = await JSON.parse(fs.readFileSync(dirr, "utf8"));
  toWrite["thoughtDate"] = today.getDate();
  fs.writeFile(dirr, JSON.stringify(toWrite), "utf8", callback);
};

const fetchLogs = async () => {
  var dirr = await path.join(__dirname, "data/local", "credentials.json");
  var jwt = JSON.parse(fs.readFileSync(dirr, "utf8"))["jwt"];
  var res = await postRequestSecure("displayLogs", {}, jwt);
  res = res.data;

  var nowDate = new Date();
  var currentDate = nowDate.toDateString();
  console.log();

  console.log(currentDate);

  for (const singleLog of res) {
    var logDateTime = singleLog["timestamp"];
    // console.log(Date(logDateTime) - Date(nowDate));

    var log = singleLog["logs"];
    var dateParsed = new Date(logDateTime);
    var logHour = dateParsed.getHours();
    var logMinute = dateParsed.getMinutes();
    var logSecond = dateParsed.getSeconds();

    if (logHour < 10) logHour = "0" + logHour.toString();
    if (logMinute < 10) logMinute = "0" + logMinute.toString();
    if (logSecond < 10) logSecond = "0" + logSecond.toString();

    logHour = logHour.toString();
    logMinute = logMinute.toString();
    logSecond = logSecond.toString();

    console.log(`${logHour}:${logMinute}:${logSecond} -> ${log}`);
  }
  console.log();
};
const fetchRank = () => {};

const changeAbout = (text) => {};

const pushLog = async (log) => {
  var dirr = path.join(__dirname, "data/local", "credentials.json");
  var jwt = JSON.parse(fs.readFileSync(dirr, "utf8"))["jwt"];
  var today = new Date();

  if (
    (await JSON.parse(fs.readFileSync(dirr, "utf8"))["thoughtDate"]) !=
    today.getDate()
  )
    await startDay();
  var res = await postRequestSecure(
    "createLog",
    {
      text: log,
    },
    jwt
  ).catch((error) => {
    console.log("error");
  });
  res = res.data.message;
  console.log(res);
};

module.exports = { logout, login, pushLog, fetchLogs, isLoggedIn };
