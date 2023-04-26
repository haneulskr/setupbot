const fs = require('fs');
const path = require('path');

// Create directories for commands and events
const dirs = ['./commands', './events'];
dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

// Create command file template
const commandTemplate = `module.exports = {
  name: 'commandName',
  description: 'A brief description of the command',
  execute(message, args) {
    // Your command logic here
  },
};`;

fs.writeFileSync(path.join(dirs[0], 'exampleCommand.js'), commandTemplate);

// Create event file template
const eventTemplate = `module.exports = {
  name: 'eventName',
  once: false,
  execute(client, ...args) {
    // Your event logic here
  },
};`;

fs.writeFileSync(path.join(dirs[1], 'exampleEvent.js'), eventTemplate);

// Create the bot entry file (index.js)
const botEntry = `require('dotenv').config();
const fs = require('fs');
const { Client, Collection } = require('discord.js');

const client = new Client({ intents: ['GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILDS'] });
client.commands = new Collection();
client.events = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(\`./commands/${file}\`);
  client.commands.set(command.name, command);
}

// Load events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(\`./events/${file}\`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}

client.login(process.env.BOT_TOKEN);`;

fs.writeFileSync('index.js', botEntry);

// Create a .env file for the bot token 
fs.writeFileSync('.env', 'BOT_TOKEN=your-bot-token-here');
