export default {
  help: {
    description: "Get a list of the bots commands and information about each one.",
    arguments: "[command]",
    example: "help"
  },
  aliases: ["h", "hlp", "commands", "commandslist", "commandlist"],
  arguments: ["?command:command"],
  async execute(comment, args) {
    if (!args[0]) return sendReply(comment, {
      title: "OptiBot Commands:",
      description: `${Array.from(client.commands).map(e => `- ${e[1].name} ${e[1].help.arguments}`).join("\n")}\n\nTo view more information about a command, please use \`${config.prefixes[0]}help [command]\``
    })
    const fields = [
      ["Description", args[0].help.description],
      ["Formatting", `\`${config.prefixes[0]}${args[0].name} ${args[0].help.arguments}\``]
    ]
    if (args[0].help.example) fields.push(["Example", `\`${config.prefixes[0]}help ${args[0].help.example}\``])
    if (args[0].aliases) fields.push(["Aliases", args[0].aliases.join(", ")])
    sendReply(comment, {
      title: `The \`${args[0].name}\` command:` ,
      fields
    })
  }
}