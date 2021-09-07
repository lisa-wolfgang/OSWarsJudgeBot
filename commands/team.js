const config = require('../config.json');
module.exports = {
	name: 'team',
	description: `Use this command to submit your scores and feedback.\nYou must type a **team name** after this command for it to function. You can review a list of all valid team names using \`${config.prefix} team list\`.\nIf you don't feel like judging all of the criteria at once, you may type a **criteria name** after the team name to just judge that criteria.`,
	execute(message, args, devMode, client) {
    const config = require('../config.json');
    const database = require("../database");

    var proceed = 0;
    var specificCriteria = false;
    var criteria1 = "";
    var criteriaCount = 0;
    var originalJudge = 0;
    var originalChannel = 0;
    var team = "";

    if (config.teams.length == 0) {
		  message.channel.send(`Sorry, you cannot judge a team because there are no teams configured. Tell the bot owner to go to \`config.json\` in this bot's code and add teams to the \`teams\` array.`)
    }
    else {
      if (args.length == 0) {
        message.channel.send(`To judge a team, type \`${config.prefix} team NAME\`, where \`NAME\` is the name of the team.`)
      }
      else {
        if (args[0].toLowerCase() == "list") {
          message.channel.send(`These are the teams that you can judge:\n` + config.teams.join(`, `))
        }
        else {
          var teamJudging = config.teams.join('~').toLowerCase().split('~').indexOf(args[0].toLowerCase())
          if (teamJudging < 0) {
            message.channel.send(`Hmm, that team doesn't seem to be configured. Please try another team. Type \`${config.prefix} team list\` to see the list of teams.`)
          }
          else {
            team = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();
            if (args.length > 1) {
              args[1] = args[1].charAt(0).toUpperCase() + args[1].slice(1).toLowerCase();
              var lowercase = config.criteria.join('|').toLowerCase().split('|');
              if (lowercase.includes(args[1].toLowerCase())) {
                beginJudging(args[1], message.author.id, message.channel.id)
              }
              else {
                if(args[1] == "Round" && args[2] == "total") {
                  beginJudging("Round Total", message.author.id, message.channel.id)
                }
                else {
                message.channel.send("This criteria is not configured. Try again.")
                }
              }
            }
            else {
            message.channel.send(`You will be judging all categories.`)
            beginJudging("", message.author.id, message.channel.id)
            }
          }
        }
      }
    }

    function beginJudging(criteria, judge, channel) {
      originalJudge = judge;
      originalChannel = channel;
      if (criteria.length > 1) {
        proceed = 2;
        specificCriteria = true;
        criteria1 = criteria;
        doSpecificCriteria(message, criteria);
      }
      else {
        proceed = (config.criteria.length) * 2;
        specificCriteria = false;
        doCriteria(message);
      }
    }

    function doSpecificCriteria(msg, criteria) {
      if (proceed % 2 == 0) {
        msg.channel.send(`You are currently evaluating the ` + criteria + ` criteria. Please enter your feedback for this criteria. If you do not wish to judge this criteria, simply type "skip".`)
      } else {
        msg.channel.send(`Please enter your numerical score, from ${config.points_min} to ${config.points_max}, for this criteria. Decimals are allowed. If you do not wish to judge this criteria, simply type a score of 0.`)
      }
    }

    function doCriteria(msg) {
      if (proceed % 2 == 0) {
        msg.channel.send(`You are currently evaluating the ` + config.criteria[criteriaCount] + ` criteria. Please enter your feedback for this criteria. If you do not wish to judge this criteria, simply type "skip".`)
      } else {
        msg.channel.send(`Please enter your numerical score, from ${config.points_min} to ${config.points_max}, for this criteria. Decimals are allowed. If you do not wish to judge this criteria, simply type a score of 0.`)
      }
    }

    client.on('message', msg => {
      //Verify that we are collecting judging data
      if(proceed > 0) {
        //Verify that they are in the correct channel and it is the correct judge
        if(msg.channel.id == originalChannel && msg.author.id == originalJudge && (config.requiredChannel == "" || msg.channel.id == config.requiredChannel)) {
          if(specificCriteria) {
            if(proceed % 2 == 0) {
              (async () => {
                await database.updateDatabase(criteria1 + team + config.judges[config.judge_ids.indexOf(msg.author.id)] + `Feedback`, msg.content);
              })();
            }
            else {
              (async () => {
                await database.updateDatabase(criteria1 + team + config.judges[config.judge_ids.indexOf(msg.author.id)] + `Score`, msg.content);
              })();
            }
          }
          else {
            if(proceed % 2 == 0) {
              (async () => {
                await database.updateDatabase(config.criteria[criteriaCount] + team + config.judges[config.judge_ids.indexOf(msg.author.id)] + `Feedback`, msg.content);
              })();
            }
            else {
              (async () => {
                await database.updateDatabase(config.criteria[criteriaCount] + team + config.judges[config.judge_ids.indexOf(msg.author.id)] + `Score`, msg.content);
              })();
              criteriaCount++;
            }
          }
          proceed--;
          if(proceed > 0) {
            doCriteria(msg);
          }
          else {
            msg.channel.send(`Thank you for judging! You scores have been collected.`);
          }
        }
      }
    });
  },
};