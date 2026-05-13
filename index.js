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

const OWNER_ID = '1350333035198939219';

let waitingStock = {};

client.once('ready', () => {
  console.log(`${client.user.tag} online`);
});

client.on('messageCreate', async message => {

  if(message.author.bot) return;

  // RESPONDER ESTOQUE
  if(waitingStock[message.author.id]) {

    fs.appendFileSync('codes.txt', `\n${message.content}`);

    delete waitingStock[message.author.id];

    return message.reply(`Código adicionado: ${message.content}`);
  }

  // PAINEL ADMIN
  if(message.content === '!admin') {

    if(message.author.id !== OWNER_ID) {
      return message.reply('Sem permissão.');
    }

    const gerar = new ButtonBuilder()
      .setCustomId('gerar_codigo')
      .setLabel('🎁 Gerar Código')
      .setStyle(ButtonStyle.Primary);

    const estoque = new ButtonBuilder()
      .setCustomId('adicionar_estoque')
      .setLabel('➕ Adicionar Estoque')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder()
      .addComponents(gerar, estoque);

    return message.channel.send({
      content: 'Painel administrativo',
      components: [row]
    });
  }
});

client.on(Events.InteractionCreate, async interaction => {

  if(!interaction.isButton()) return;

  // GERAR CÓDIGO
  if(interaction.customId === 'gerar_codigo') {

    let codes = fs.readFileSync('codes.txt', 'utf8')
      .split('\n')
      .filter(code => code.trim() !== '');

    if(codes.length === 0) {
      return interaction.reply({
        content: 'Sem estoque.',
        ephemeral: true
      });
    }

    const code = codes.shift();

    fs.writeFileSync('codes.txt', codes.join('\n'));

    try {

      await interaction.user.send(`Seu código: ${code}`);

      await interaction.reply({
        content: 'Código enviado na DM.',
        ephemeral: true
      });

    } catch {

      await interaction.reply({
        content: 'Ative sua DM.',
        ephemeral: true
      });

    }
  }

  // ADICIONAR ESTOQUE
  if(interaction.customId === 'adicionar_estoque') {

    if(interaction.user.id !== OWNER_ID) {
      return interaction.reply({
        content: 'Sem permissão.',
        ephemeral: true
      });
    }

    waitingStock[interaction.user.id] = true;

    return interaction.reply({
      content: 'Envie o código que deseja adicionar.',
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);
