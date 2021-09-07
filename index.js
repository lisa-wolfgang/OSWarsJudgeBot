// This is a bot used in the OS Wars VI server for submitting judging and feedback, then formatting it into Scratch list format

// Toggle devMode - this allows whoever is set as the bot owner to test potentially unstable features without the risk of others breaking something
var devMode = false;

// Constants - any value that won't change
const fs = require('fs');
const Discord = require('discord.js');
const keep_alive = require('./keep_alive.js');
const config = require('./config.json');

var client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs
	.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
const token = process.env.DISCORD_BOT_SECRET;
const thisBot = process.env.THISBOT;

// Variables - any value that might change and placeholders for value storage
var args;
var command;

// When bot is booted up
client.on('ready', () => {
	console.log('The OS Wars Judge Bot is now listening for commands.');
	setStatus();
});

// When message is sent
client.on('message', message => {
	args = message.content
		.slice(config.prefix.length)
		.trim()
		.split(/ +/);
	command = args.shift().toLowerCase();

	// Ignore all messages that are not from the bot owner in devMode
	if (
		!devMode ||
		config.bot_owner_ids.includes(message.author.id) ||
		message.author.bot) {
		// Instant checks - these are pertinent to features that scan messages without the bot's prefix

		/*LOL nothing is here*/

		// Anti-self-trigger statement
		if (
			!message.content.toLowerCase().startsWith(config.prefix) ||
			message.author.bot
		)
			return;

		// Command framework - all code that runs when a command is sent
		if (!message.author.bot || message.author.id == thisBot) {
			if (config.judge_ids.includes(message.author.id)) {
				if (config.requiredChannel == '' ||message.channel.id == config.requiredChannel) {
					if (client.commands.has(command)) {
						try {
							// Special command calculations - mostly used when values need to be accessible in both index.js and the command's JS file

							// Help
							if (command == 'help') {
								client.commands
									.get(command)
									.execute(message, args, client.commands, devMode);
								return;
							}

							// Normal commands
							client.commands
								.get(command)
								.execute(message, args, devMode, client);

							// Runs when an error occurs during command execution
						} catch (error) {
							console.error(error);
							message.channel.send('Oh no! Something went wrong.');
						}

						// Commands without their own JS file
					} else {
						// Devmode
						if (command == 'dev') {
							if (config.bot_owner_ids.includes(message.author.id)) {
								devMode = !devMode;
                setStatus();
							} else {
								message.channel.send(
									`Sorry, ${message.author}, only the bot owners ${
										config.bot_owners
									} can toggle devmode.`
								);
							}

							// Unrecognized command
						} else {
							message.channel.send(
								`Sorry, I didn\'t recognize that command. Check for typos!\nType \`${
									config.prefix
								} help\` to discover all of the commands you can use.`
							);
						}
					}
				}
        else {
					message.channel.send(
						`This bot can only be used in <#${config.requiredChannel}>.`
					);
				}
			}
      else {
				const quips = [
					`Sorry, but it doesn't look like you're a judge. Only judges can access this bot.`,
					`I'm sure you're a wonderful and special person, but only judges can access this bot.`,
					`Sorry, you're not allowed to change your team's scores to whatever you want. Only judges can access this bot.`,
					`Nice try, normie, but only judges can access this bot.`,
					`What do you think you're doing? Only judges can access this bot!`,
					`Stop trying already. Only judges can access this bot!`
				];
				message.channel.send(quips[Math.floor(Math.random() * quips.length)]);
				console.log('Unauthorized access blocked.');
			}
		}

		// When devMode is on, if someone other than those specified in the corresponding if statement tries to use the bot, this message will be sent instead.
	} else {
		if (devMode && message.content.toLowerCase().startsWith(config.prefix)) {
			message.channel.send(
				`I\'m in devmode right now, which means that I\'m unstable and can\'t be accessed until what the bot owners ${
					config.bot_owners
				} are working on is finished. Try again later!`
			);
		}
	}
});

// When bot is booted up, access Discord
client.login(token);

// Sets the bot's playing/watching status
function setStatus(status) {
	if (devMode) {
		client.user.setActivity('devmode', { type: 'PLAYING' });
	} else {
		if (status == null) {
			client.user.setActivity(`for a ${config.prefix} command`, {
				type: 'WATCHING'
			});
		} else {
			client.user.setActivity(`${status}`, { type: 'PLAYING' });
		}
	}
}

// repl.it shuts down its repl.co servers when they go for an hour without any activity. To prevent this, a third-party service called Uptime Robot has been configured to ping this bot once every 15 minutes. When the bot receives a ping, it will post in the internal log, which counts as "active" to repl.it.
keep_alive();
