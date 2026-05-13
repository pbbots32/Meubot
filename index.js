const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
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

// FUNÇÃO PRA PEGAR ESTOQUE
function getStock() {
  return fs.readFileSync('codes.txt', 'utf8')
    .split('\n')
    .filter(code => code.trim() !== '');
}

// CRIAR PAINEL
async function createPanel(channel) {

  const codes = getStock();

  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('🎁 Gere seu codiguinho!')
    .setDescription(
`Clique no botão abaixo para gerar um código automaticamente.

📦 Estoque atual: **${codes.length}**
⚡ Entrega instantânea
🔒 Código único`
    )
    .setFooter({
      text: 'Sistema automático'
    })
    .setTimestamp();

  const button = new ButtonBuilder()
    .setCustomId('gerar_codigo')
    .setLabel('Gerar Código')
    .setEmoji('🎁')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder()
    .addComponents(button);

  const panelMessage = await channel.send({
    embeds: [embed],
    components: [row]
  });

  return panelMessage;
}

// COMANDO
client.on('messageCreate', async message => {

  if(message.author.bot) return;

  if(message.content === '!tballs') {

    await createPanel(message.channel);

  }
});

// BOTÃO
client.on(Events.InteractionCreate, async interaction => {

  if(!interaction.isButton()) return;

  if(interaction.customId === 'gerar_codigo') {

    let codes = getStock();

    if(codes.length === 0) {

      return interaction.reply({
        content: 'Sem estoque disponível.',
        ephemeral: true
      });
    }

    const code = codes.shift();

    fs.writeFileSync('codes.txt', codes.join('\n'));

    try {

      await interaction.user.send(
`🎁 Seu código:

${code}`
      );

      // ATUALIZAR PAINEL
      const updatedEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('🎁 Gere seu codiguinho!')
        .setDescription(
`Clique no botão abaixo para gerar um código automaticamente.

📦 Estoque atual: **${codes.length}**
⚡ Entrega instantânea
🔒 Código único`
        )
        .setFooter({
          text: 'Sistema automático'
        })
        .setTimestamp();

      await interaction.message.edit({
        embeds: [updatedEmbed]
      });

      await interaction.reply({
        content: 'Confira sua DM.',
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
