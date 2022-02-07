/**
 * Replace the custom bot placeholders with real data.
 * @param {String} string
 * @param {GuildMember} member
 */

module.exports = (string, member) => {
	if (!string || !member) {
		throw new Error('Missing required parameters');
	}

	return string
		.replaceAll('{user}', member)
		.replaceAll('{user.mention}', member)
		.replaceAll('{user.name}', member.user.username)
		.replaceAll('{user.tag}', member.user.tag)
		.replaceAll('{user.id}', `${member.user.id}`)
		.replaceAll('{user.avatar_url}', member.user.displayAvatarURL({dynamic: true, format: 'png', size: 1024}))
		.replaceAll('{guild}', member.guild.name)
		.replaceAll('{guild.name}', member.guild.name)
		.replaceAll('{guild.member_count}', `${member.guild.memberCount}`)
		.replaceAll('{guild.icon_url}', member.guild.iconURL({dynamic: true, format: 'png', size: 1024}))
		.replaceAll('{guild.id}', `${member.guild.id}`)
		.replaceAll('{server.verification_level}', member.guild.verificationLevel);
};
