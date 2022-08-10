export default {
  help: {
    description: "Get a list of the bots commands and information about each one.",
    arguments: "[command]",
    example: "help"
  },
  aliases: ["h", "hlp", "commands", "commandslist", "commandlist"],
  arguments: ["?command:command"],
  async execute(comment, args) {
    try {
      const faq = await fetch("https://raw.githubusercontent.com/ewanhowell5195/OptiBotReddit/main/json/faq.json").then(e => e.json())
      console.log(faq)
    } catch (err) {
      console.log(err)
      sendError(comment, {
        title: "Unable to fetch FAQ data",
        description: "Please try again later"
      })
    }
  }
}