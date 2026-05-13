const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require('discord.js');

const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`${client.user.tag} online`);
});

client.on('messageCreate', async message => {

  if(message.author.bot) return;

  if(message.content === '!painel') {

    const button = new ButtonBuilder()
      .setCustomId('gerar_codigo')
      .setLabel('🎁 Gerar Código')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({
      content: 'Clique no botão para gerar seu código.',
      components: [row]
    });
  }
});

client.on(Events.InteractionCreate, async interaction => {

  if(!interaction.isButton()) return;

  if(interaction.customId === 'gerar_codigo') {

    let codes = fs.readFileSync('codes.txt', 'utf8')
      .split('\n')
      .filter(code => code.trim() !== '');

    if(codes.length === 0) {
      return interaction.reply({
        content: 'Sem estoque disponível.',
        ephemeral: true
      });
    }

    const code = codes.shift();

    fs.writeFileSync('codes.txt', codes.join('\n'));

    try {

      await interaction.user.send(`Seu código: ${code}`);

      await interaction.reply({
        content: 'Código enviado na sua DM.',
        ephemeral: true
      });

    } catch {

      await interaction.reply({
        content: 'Ative sua DM para receber o código.',
        ephemeral: true
      });

    }
  }
});

client.login(process.env.TOKEN);
