var Botkit = require('botkit')
var cheerio = require('cheerio')
var request = require('request')

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

while (true) {
	controller.say("Testing");
	request('http://ottoneu.fangraphs.com/research/recent_trades', handleHtml)
	sleep (60000)
}

function handleHtml(err, resp, html) {
  if (err) return console.error(err)
  var parsedHtml = cheerio.load(html)
  parsedHtml('tr.even').map(function(i, tr) {
	  controller.say(tr);
  })
}

