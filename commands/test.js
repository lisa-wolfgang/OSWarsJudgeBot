module.exports = {
	name: 'test',
	description: 'Test if the bot is online.',
	execute(message, args, devMode) {
    const quips = [`Da-ta!`]
		message.channel.send(`I'm currently online! ${quips[Math.floor(Math.random() * quips.length)]}`)
	},
};