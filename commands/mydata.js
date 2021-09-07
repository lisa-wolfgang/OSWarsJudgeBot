module.exports = {
	name: 'mydata',
	description: `Tells you what you've judged so far and what you still have yet to judge.\nTo see what criteria you've judged for a specific team, type a **team name** after the command.\nTo see what score/feedback you gave for a specific team and criteria, type a **team name** and a **criteria** after the command.`,
	execute(message, args, devMode, client) {
    const database = require("../database");
    const config = require("../config.json");

    var teamJudging;
    var judgeStuff = [];
    var teamsJudged = "";
    var teamsJudgedPartial = "";

    message.channel.send("Processing your data...");

    if(args.length == 0) {
      (async () => {
        for(var i = 0; i < config.teams.length; i++) {
          var criteriaCount = 0; 
          for(var j = 0; j < config.criteria.length; j++) {
            if(await database.getDatabase(config.criteria[j] + config.criteria[j] + config.judges[config.judge_ids.indexOf(message.author.id)] + "Feedback") != null) {
              judgeStuff.push(config.teams[i] + " " + config.criteria[j] + " Feedback");
              criteriaCount++;
            }
            if(await database.getDatabase(config.criteria[j] + config.teams[i] + config.judges[config.judge_ids.indexOf(message.author.id)] + "Score") != null) {
              judgeStuff.push(config.teams[i] + " " + config.criteria[j] + " Score");
              criteriaCount++;
            }
          }
          if(criteriaCount == config.criteria.length) {
            teamsJudged += config.teams[i] + ", ";
          }
          else {
            if(criteriaCount > 0) {
              teamsJudgedPartial += config.teams[i] + ", ";
            }
          }
        }

        if(judgeStuff.length == 0) {
        message.channel.send("You have not completed any judging yet. Note: If you know you have completed some judging, wait a couple minutes to make sure the database is updated.");
        }
        else {
          if(teamsJudged.length > 0 && teamsJudgedPartial.length > 0) {
            message.channel.send("You have finished judging: " + teamsJudged.substring(0, teamsJudged.length-2) + "\nYou are in progress of judging: " + teamsJudgedPartial.substring(0, teamsJudgedPartial.length-2));
          }
          else {
            if(teamsJudged.length > 0) {
              message.channel.send("You have finished judging: " + teamsJudged.substring(0, teamsJudged.length-2) + ", and you do not have any judging in progress.");
            }
            else {
              message.channel.send("You are in progress of judging: " + teamsJudgedPartial.substring(0, teamsJudgedPartial.length-2));
            }
          }
        }
      })();
    }
    else {
      teamJudging = config.teams.join('~').toLowerCase().split('~').indexOf(args[0].toLowerCase())
      if(args.length == 1) {
        if (teamJudging < 0) {
          message.channel.send(`Hmm, that team doesn't seem to be configured. Please try another team. Type \`${config.prefix} team list\` to see the list of teams.`)
        }
        else {
          var criteriaCount = 0;
          (async () => {
            for(var j = 0; j < config.criteria.length; j++) {
              if(await database.getDatabase(config.criteria[j] + config.teams[teamJudging] + config.judges[config.judge_ids.indexOf(message.author.id)] + "Feedback") != null && await database.getDatabase(config.criteria[j] + config.teams[teamJudging] + config.judges[config.judge_ids.indexOf(message.author.id)] + "Score") != null) {
                judgeStuff.push(config.criteria[j]);
                criteriaCount++;
              }
            }
            if(judgeStuff.length == 0) {
              message.channel.send("You have not completed any judging for Team " + config.teams[teamJudging] + " yet.")
            }
            else {
              if(criteriaCount == config.criteria.length) {
                message.channel.send("You have completed all judging for Team " + config.teams[teamJudging] + ".");
              }
              else {
                message.channel.send("For Team " + config.teams[teamJudging] + ", you have completed: " + judgeStuff.join(", ") + ".");
              }
            }
          })()
        }
      }
      else {
        if(args.length > 1) {
          (async ()=> {
            args[1] = args[1].charAt(0).toUpperCase() + args[1].slice(1).toLowerCase();
            var lowercase = config.criteria.join('|').toLowerCase().split('|');
            if (lowercase.includes(args[1].toLowerCase())) {
              criteriaJudging = config.criteria.join('~').toLowerCase().split('~').indexOf(args[1].toLowerCase())
              message.channel.send("Your Feedback: " + await database.getDatabase(config.criteria[criteriaJudging] + config.teams[teamJudging] + config.judges[config.judge_ids.indexOf(message.author.id)] + "Feedback") + "\nYour Score: " + await database.getDatabase(config.criteria[criteriaJudging] + config.teams[teamJudging] + config.judges[config.judge_ids.indexOf(message.author.id)]+ "Score"));
            }
            else {
              if (args[1] == "Round" && args[2] == "total") {
              message.channel.send("Your Feedback: " + await database.getDatabase("Round Total" + config.teams[teamJudging] + config.judges[config.judge_ids.indexOf(message.author.id)] + "Feedback") + "\nYour Score: " + await database.getDatabase("Round Total" + config.teams[teamJudging] + config.judges[config.judge_ids.indexOf(message.author.id)]+ "Score"));
              }
              else {
              message.channel.send("This criteria is not configured. Try again.")
              }
            }
          })();
        }
      }
    }
	},
};