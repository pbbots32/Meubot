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
    content: '🔒 Painel administrativo',
    components: [row]
  });
}

// PAINEL PÚBLICO
if(message.content === '!tballs') {

  const gerar = new ButtonBuilder()
    .setCustomId('gerar_codigo')
    .setLabel('🎁 Gerar Código')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder()
    .addComponents(gerar);

  let codes = fs.readFileSync('codes.txt', 'utf8')
    .split('\n')
    .filter(code => code.trim() !== '');

  return message.channel.send({
    content:
`# 🎁 Gere seu codiguinho!

📦 Estoque atual: ${codes.length}

Clique no botão abaixo para gerar seu código.`,
    components: [row]
  });
}
