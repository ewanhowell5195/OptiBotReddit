export default {
  help: {
    description: "Get a list of the bots commands and information about each one.",
    arguments: "[command]",
    example: "help"
  },
  aliases: ["h", "hlp", "commands", "commandslist", "commandlist"],
  arguments: ["?command:command"],
  async execute(comment, args) {
    // const faq = await fetch()
  }
}