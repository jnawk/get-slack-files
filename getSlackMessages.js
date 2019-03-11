#!/usr/bin/env node
require('isomorphic-fetch');

const processArgs = process.argv.slice(2);

const token = processArgs[0]
if(!token) {
  console.error('error: need a token');
  process.exit(1);
}

const channel = 'D7YF9HVP1'
const users = {
  'U08KLB5PB': 'Phil',
  'U7W0W5YRY': 'Jay'
}

var count = 0;

const getMessages = mostRecent => {
  var oldest;
  if(!mostRecent) {
    oldest = 1;
  } else {
    oldest = mostRecent.ts;
  }
  const arguments = {
    token: token,
    channel: channel,
    oldest: oldest
  };
  const argString = Object.keys(arguments)
    .map(arg => arg + '=' + arguments[arg])
    .join('&');

  const url = ['https://slack.com/api/im.history', argString].join('?');
  return fetch(url).then(response => {
    count = count + 1;
    return response.json();
  });
};

const go = () => {
  getMessages(newest)
    .then(response => {
      var messages = response.messages;

      messages = messages.sort((left, right) => left.ts - right.ts);
      newest = messages[messages.length - 1];

      messages.map(message => {
        console.log(new Date(message.ts * 1000) + ' ' + users[message.user] + ":\n" + message.text);
      });

      return response.has_more;
    }).then(more => {
      if(more) {
        setTimeout(go, 0);
      }
    });
};

var newest;
if(processArgs[1]) {
  newest = {ts: processArgs[1]}
}

go();
