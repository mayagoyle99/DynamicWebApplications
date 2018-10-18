//Pino is a logger. Loggers 
const pino = require('pino');
const logger = pino(pino.destination('./logs'));
const config = require('./config.js');
const cron = require('node-cron');

//requires data from both of the JSON files
const jsonSentencesData = require('./data/sentences.json');
const jsonEmojisData = require('./data/emojis.json');

let Twit = require('twit');
let T = new Twit(config);

// const everySecond = '*/4 * * * * *';
// const every15seconds = '*/15 * * * * *';
// const onceADay = '0 0 * * *';
//This frequency is determined by CRON (link)
const twiceADay = '25 12,0 * * *';

cron.schedule(twiceADay, () => {
  postTweet();
});

//Pulls a random sentence
let getRandomSentence = () => {
  return rand(jsonSentencesData);
};

//Pulls a random emoji that matches the sentence element
let getEmojiForSentenceElement = (element) => {
  return rand(jsonEmojisData[element]);
};

//Where the tweet is constructed
let postTweet = () => {
  let selectedSentence = getRandomSentence();
  let emoji = getEmojiForSentenceElement(selectedSentence.element);

  let quote = `${emoji} : ${rand(selectedSentence.sentences)}`;


  const tweet = {
    status: quote
  };

  // console.log(tweet, { element: selectedSentence.element });

  T.post('statuses/update', tweet, didItTweet);
};

let didItTweet = (err, data, response) => {
  const time = new Date().toISOString();
  let log = `Timestamp: ${time}\n`;

  if (err) {
    log += `Reason: ${err}\nResult: It didn't work.\n`;
    logger.error(log);
  } else {
    log += `Text: ${data.text}\nResult: It worked.\n`;
    logger.info(log);
  }

  console.log(log);
};

let rand = (items) => {
  return items[~~(items.length * Math.random())];
};
