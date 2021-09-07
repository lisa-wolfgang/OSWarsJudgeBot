module.exports = {
	name: 'generate',
	description: 'Generate the judge feedback and score files. (Only available to bot owners)',
	execute(message, args, devMode) {
    const config = require("../config.json");
    const database = require("../database.js");
    const fs = require("fs");

    var feedbackData = [];
    var scoreData = [];
    var progressMsg;
    var timeEstimate = config.criteria;
    var temp;

    if (config.teams.length == 0 || config.judges.length == 0 || config.criteria.length == 0) {
		  message.channel.send(`Sorry, you cannot generate the files because either the teams, judges, or criteria have not been configured properly. Tell the bot owner to go to \`config.json\` in this bot's code and fill everything out.`);
    }
    else {
      if (!config.bot_owner_ids.includes(message.author.id)) {
        message.channel.send(`Sorry, only the bot owners ${config.bot_owners} can use this command.`);
      }
      else {
        message.channel.send(`Generating files. This will take about 40 more seconds...`).then((message) => {progressMsg = message});
        (async () => {
          try {
            for (var i = 0; i < config.criteria.length; i++) {
              for (var j = 0; j < config.teams.length; j++) {
                for (var k = 0; k < config.judges.length; k++) {
                  temp = await database.getDatabase(config.criteria[i] + config.teams[j] + config.judges[k] + "Feedback")
                  if (temp == "skip" || temp == null) {
                    feedbackData.push("");
                  }
                  else {
                    feedbackData.push(temp.replace(/,/g, "~"));
                  }
                  temp = await database.getDatabase(config.criteria[i] + config.teams[j] + config.judges[k] + "Score")
                  if ((temp != null && Number.parseInt(temp) >= config.points_min && Number.parseInt(temp) <= config.points_max)) {
                    scoreData.push(temp);
                  }
                  else {
                    scoreData.push(0);
                  }
                  // Does the progress log in the console
                  console.log(`${((i)*config.teams.length*config.judges.length) + ((j)*config.judges.length) + k+1} - ${config.criteria[i]} - ${config.teams[j]} - ${config.judges[k]}`)
                }
              }
              progressMsg.edit(`Generating files. This will take about ${40-(Math.round(10*((i+1)/config.judges.length))/10)*40} more seconds...`)
            }
            writeToTxtFiles()
            progressMsg.edit("Files generated.");
          } catch (err) {
            console.log(err)
            progressMsg.edit("Oops, it looks like the file generation was interrupted. This can be caused by a repl network issue. Please try again.");
          }
        })()
      }
    }

    function writeToTxtFiles() {
      fs.writeFile("/home/runner/OSWarsJudgeBot/output/scores.txt", scoreData.join("\n"), function (err) {
        if (err) console.log('Something unpog happened');
      })
      fs.writeFile("/home/runner/OSWarsJudgeBot/output/feedback.txt", feedbackData.join("\n"), function (err) {
        if (err) console.log('Something unpog happened');
      })
    }
	},
};