const pino = require('pino');
const logger = pino(pino.destination('./logs'));
const config = require('./config.js');
const cron = require('node-cron');

const jsonSentencesData = require('./data/sentences.json');
const jsonEmojisData = require('./data/emojis.json');

let Twit = require('twit');
let T = new Twit(config);

// const everySecond = '*/4 * * * * *';
// const every15seconds = '*/15 * * * * *';
// const onceADay = '0 0 * * *';
const twiceADay = '0 1,13 * * *';

cron.schedule(twiceADay, () => {
  postTweet();
});

let getRandomSentence = () => {
  return rand(jsonSentencesData);
};

let getEmojiForSentenceElement = (element) => {
  return rand(jsonEmojisData[element]);
};

let postTweet = () => {
  let selectedSentence = getRandomSentence();
  let emoji = getEmojiForSentenceElement(selectedSentence.element);

  let quote = `${emoji} : ${selectedSentence.sentence}`;

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
