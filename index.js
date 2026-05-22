require('dotenv').config();
  if (interaction.commandName === 'estoque') {
    const estoque = carregarEstoque();

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📦 Estoque Atual')
      .setDescription(`Atualmente existem \`${estoque.codigos.length}\` codiguins disponíveis.`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'painel') {
    const estoque = carregarEstoque();

    const embed = new EmbedBuilder()
      .setColor('#00ff88')
      .setTitle('✨ PAINEL DE CODIGUINS')
      .setDescription('Sistema automático de estoque de codiguins')
      .addFields(
        {
          name: '📦 Disponíveis',
          value: `\`${estoque.codigos.length}\``,
          inline: true
        },
        {
          name: '⚡ Status',
          value: '`ONLINE`',
          inline: true
        }
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
        text: 'Sistema profissional'
      })
      .setTimestamp();

    const msg = await interaction.channel.send({
      embeds: [embed]
    });

    const embeds = carregarEmbeds();

    embeds[interaction.guild.id] = {
      canalId: interaction.channel.id,
      mensagemId: msg.id
    };

    salvarEmbeds(embeds);

    await interaction.reply({
      content: 'Painel criado com sucesso',
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);
