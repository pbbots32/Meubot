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

// PEGAR ESTOQUE
function getCodes() {

  return fs.readFileSync('codes.txt', 'utf8')
    .split('\n')
    .filter(code => code.trim() !== '');
}

// BOT ONLINE
client.once('ready', () => {
  console.log(`${client.user.tag} online`);
});

// COMANDO
client.on('messageCreate', async message => {

  if(message.author.bot) return;

  if(message.content === '!painel') {

    let codes = getCodes();

    const gerar = new ButtonBuilder()
      .setCustomId('gerar_codigo')
      .setLabel('🎁 Gerar Código')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
      .addComponents(gerar);

    await message.channel.send({
      content:
`# 🎁 Gere seu codiguinho!

📦 Estoque atual: ${codes.length}

Clique no botão abaixo para gerar seu código.`,
      components: [row]
    });
  }
});

// BOTÃO
client.on(Events.InteractionCreate, async interaction => {

  if(!interaction.isButton()) return;

  if(interaction.customId === 'gerar_codigo') {

    let codes = getCodes();

    // SEM ESTOQUE
    if(codes.length === 0) {

      return interaction.reply({
        content: 'Sem estoque disponível.',
        ephemeral: true
      });
    }

    // PEGAR CÓDIGO
    const code = codes.shift();

    // SALVAR ESTOQUE
    fs.writeFileSync('codes.txt', codes.join('\n'));

    try {

      // ENVIAR DM
      await interaction.user.send(
`🎁 Seu código:

${code}`
      );

      // RESPOSTA
      await interaction.reply({
        content: 'Confira sua DM.',
        ephemeral: true
      });

      // BOTÃO
      const gerar = new ButtonBuilder()
        .setCustomId('gerar_codigo')
        .setLabel('🎁 Gerar Código')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder()
        .addComponents(gerar);

      // ATUALIZAR PAINEL
      await interaction.message.edit({
        content:
`# 🎁 Gere seu codiguinho!

📦 Estoque atual: ${codes.length}

Clique no botão abaixo para gerar seu código.`,
        components: [row]
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
